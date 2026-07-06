# Plán produkční připravenosti — expandmatrix.com

> Datum auditu: 2026-07-06
> Rozsah: kompletní audit kódu (architektura, SEO, přístupnost, výkon, bezpečnost, konfigurace) + testy proti produkci a lokálnímu prostředí.
> Metodika: typecheck, lint, produkční build, curl testy proti https://expandmatrix.com, vizuální test v Chrome, `pnpm audit`, 4 hloubkové průchody kódem.

---

## Výsledky testů

| Test | Výsledek | Poznámka |
|---|---|---|
| `pnpm typecheck` | ✅ PASS | 0 chyb |
| `pnpm lint` | ✅ PASS | 0 chyb |
| `pnpm build` (lokálně, Node 26) | ❌ FAIL | `scripts/build-payload-config.mjs` — esbuild CJS named import; `cross-env@10` — stejný ESM problém. Na Netlify (Node 24.4.1) build prochází. |
| `pnpm audit --prod` | ❌ 88 zranitelností | 2 critical, 25 high, 52 moderate, 9 low |
| Produkce: HTTP status stránek | ✅ 200 | /en, /cs, /en/blog, /en/terms, /en/privacy |
| Produkce: 404 handling | ✅ 404 | neexistující URL vrací 404 |
| Produkce: velikost HTML | ⚠️ 434–597 KB | homepage 594 KB nekomprimovaně (~88 KB gzip) — příliš |
| Produkce: sitemap | ❌ | obsahuje URL vracející 404 (viz S2) |
| Produkce: CSP hlavička | ❌ chybí | ani Report-Only verze z netlify.toml se nedoručuje |
| Vizuální test (Chrome) | ❌ bug | hero sekce zůstává černá při scroll-restoration (viz U1) |

---

## 0. KRITICKÉ — Bezpečnost (udělat OKAMŽITĚ)

### S0.1 Tajné klíče commitnuté v gitu 🔴
**Kde:** `.env` (trackovaný v gitu!), `netlify.toml:12-21`, `.env.example` (obsahuje reálné hodnoty, ne placeholdery)

V repu jsou v plaintextu:
- `DATABASE_URI` — MongoDB Atlas connection string včetně hesla
- `SMTP_PASS` — Gmail app password pro info@expandmatrix.com
- `PAYLOAD_SECRET` — umožňuje padělat admin tokeny Payload CMS
- `REVALIDATION_SECRET`

Historie gitu je obsahuje minimálně v 7 commitech. Repo je privátní, ale interní riziko je vysoké a jakýkoli únik přístupu k repu = únik všech credentials. Pozn.: `docs/security/secret-audit.md` tvrdí, že v historii žádné secrets nejsou — to je nepravdivé, dokument opravit/smazat.

**Akce (v tomto pořadí):**
1. Rotovat všechny 4 credentials (MongoDB heslo uživatele `em`, Gmail app password, nový PAYLOAD_SECRET, nový REVALIDATION_SECRET).
2. Nové hodnoty vložit do Netlify UI (Site settings → Environment variables), NE do souborů.
3. Odstranit hodnoty z `netlify.toml` a `.env.example` (nahradit placeholdery), přestat trackovat `.env` (`git rm --cached .env` + `.gitignore`).
4. Vyčistit historii (BFG Repo-Cleaner) nebo po rotaci akceptovat historickou expozici.

### S0.2 Payload CMS — pre-auth account takeover CVE 🔴
**Kde:** `package.json` — `payload@3.62.0` (zranitelné < 3.79.1), advisory GHSA-hp5w-3hxx-vmwf
Útočník může resetovat heslo admin uživatele bez autentizace přes parameter injection v password recovery.

**Akce:** `pnpm update payload@latest` (min. 3.79.1) + `@payloadcms/graphql`, `@payloadcms/next`, `@payloadcms/db-mongodb`, `@payloadcms/richtext-lexical`. Tím se vyřeší i většina transitivních CVE (undici ×5, picomatch ReDoS, dompurify). Pak `pnpm update nodemailer@latest` (DoS v AddressParser) a znovu `pnpm audit --prod`.

### S0.3 CSP se vůbec nedoručuje 🟠
**Kde:** `netlify.toml:43` definuje `Content-Security-Policy-Report-Only`, ale produkce žádnou CSP hlavičku nevrací (ověřeno curl). Hlavičky z `[[headers]]` bloků netlify.toml zjevně přebíjí Next.js runtime plugin.
**Akce:** Přesunout CSP do `next.config.mjs` `headers()`. Nejdřív Report-Only, po vyčištění reportů přepnout na enforcement. Zvážit odstranění `'unsafe-inline'`/`'unsafe-eval'` ze script-src (nonce-based). Doplnit `Cross-Origin-Resource-Policy: same-origin`.

### S0.4 Menší bezpečnostní doplňky 🟡
- `src/app/api/newsletter/route.ts:27` — validovat formát e-mailu regexem před předáním do Payload (obrana do hloubky; souvisí s nodemailer DoS).
- `scripts/reset-admin.cjs` maže všechny uživatele — přidat guard proti spuštění v produkci.
- `src/payload/collections/Media.ts` — nastavit `maxFileSize`, zvážit odebrání XML MIME typů (XXE riziko u SVG/XML uploadů).
- Rate limiter (`src/utils/rateLimit.ts`) je in-memory — u multi-instance nasazení nefunguje; zdokumentovat, případně Redis.
- ✅ Path traversal v `/api/media/file/[...path]` je správně ošetřen — bez akce.

---

## 1. KRITICKÉ — SEO a obsah

### S1.1 Sitemap obsahuje mrtvé URL 🔴 (ověřeno na produkci)
**Kde:** `src/app/sitemap.ts`
- `/partners`, `/team`, `/faq` → 307 redirect na `/en/partners` atd. → **404**. Stránky existují v route group `(site)`, ale middleware je přesměruje pod locale prefix, kde neexistují → jsou v produkci **nedosažitelné** a sitemap na ně přesto odkazuje.
- Kořenové `https://expandmatrix.com` v sitemap force-redirectuje na `/en` (redirect v sitemap = špatná praxe).
- Chybí blog posty a `<xhtml:link>` hreflang alternates.

**Akce:**
1. Rozhodnout: stránky `/faq`, `/team`, `/partners` buď přesunout pod `src/app/[locale]/` (a lokalizovat), nebo smazat (obsah už je na homepage v sekcích) — teď jsou to mrtvé stránky.
2. Ze sitemap odstranit kořenovou URL a mrtvé cesty; přidat blog posty (dotaz na CMS) a hreflang alternates.

### S1.2 aggregateRating bez recenzí — riziko penalizace 🔴
**Kde:** `src/app/[locale]/layout.tsx` (JSON-LD ProfessionalService)
Schema deklaruje `aggregateRating: 4.9, reviewCount: 35`, ale na webu nejsou žádné viditelné recenze. Porušuje Google guidelines (self-serving reviews / data nekonzistentní s obsahem) → riziko manual action na structured data.
**Akce:** Buď aggregateRating odstranit, nebo na web přidat reálné recenze (a ideálně jednotlivé `Review` objekty do schema).

### S1.3 H1 je v serverovém HTML prázdné 🟠 (ověřeno)
**Kde:** `src/components/HeroAnimated.tsx` — hero nadpis renderují klientské `ScrambleText` komponenty (`BAILOUT_TO_CLIENT_SIDE_RENDERING` v SSR HTML). Googlebot i uživatelé bez JS vidí prázdný H1; `aria-label` to jistí jen pro čtečky.
**Akce:** Renderovat text serverově a scramble efekt aplikovat progresivně (počáteční text = finální text; animace jen vizuální overlay).

### S1.4 Blog 🟠
- Blog je prázdný („No articles yet") a přitom prominentně v navigaci + `force-dynamic` + `no-store` — každý request jde na origin. Kombinace Strapi (blog) + Payload (zbytek) není zdokumentovaná.
- Chybí Article JSON-LD na `[slug]` stránce, og:image na blog listu, blog posty v sitemap.
**Akce:** Krátkodobě: buď publikovat obsah, nebo blog z navigace dočasně skrýt. Přepnout z `force-dynamic` na ISR (`revalidate: 300`) + webhook revalidaci ze Strapi. Doplnit Article JSON-LD a metadata. Zdokumentovat dual-CMS architekturu v README.

### S1.5 Metadata mezery 🟡
- `privacy`/`terms` stránky: chybí canonical + og tagy.
- `(site)` stránky (pokud zůstanou): metadata jen anglicky, bez lokalizace.
- Blog post: chybí `article:author`, `article:section`.
**Akce:** Doplnit `generateMetadata` s canonical/og/hreflang na všech stránkách.

---

## 2. VYSOKÁ — Výkon

### P1 HTML stránky jsou obrovské (594 KB homepage) 🔴
Dvě hlavní příčiny:
1. **`experimental.inlineCss: true`** (`next.config.mjs:105`) — do každé HTML odpovědi se inlinuje ~188 KB CSS (31 % stránky) a duplikuje se i v RSC flight payloadu.
2. **Celý i18n messages objekt (~19 KB/locale) se serializuje do flight payloadu** — `src/app/[locale]/layout.tsx` předává `NextIntlClientProvider` kompletní `messages`.

**Akce:**
1. Vypnout `inlineCss` (nebo změřit LCP dopad před/po) a nechat externí stylesheet s immutable cache.
2. Předávat klientovi jen potřebné namespaces: `messages={pick(messages, ['common','hero','navigation',...])}`.
3. Prověřit, proč je vygenerované CSS tak velké (vanilla-cookieconsent CSS importované do bundle v `src/components/CookieConsent.tsx:5` — lazy-loadovat).

### P2 Fotky týmu 670–990 KB 🔴
**Kde:** `public/images/team/` — `matej-venclik.webp` 993 KB, `matej_stipcak.webp` 673 KB, `matty.webp` 673 KB.
Navíc `sizes` prop v `TeamSectionClient.tsx` neodpovídá reálné velikosti karty → prohlížeč stahuje zbytečně velké varianty.
**Akce:** Přegenerovat zdroje na max ~300 KB / ~1200 px šířky; opravit `sizes` podle skutečného layoutu; `loading="lazy"` na ne-první karty.

### P3 Chybějící font weighty → faux-bold 🟠
**Kde:** `src/app/fonts.ts` načítá Lato 300/400/700, ale CSS používá `font-semibold` (600), `font-extrabold` (800), `font-black` (900) → prohlížeč syntetizuje tučnost (horší rendering, layout shift).
**Akce:** Buď doplnit weighty 600 (a příp. 900), nebo sjednotit CSS na 400/700.

### P4 Nadbytečný klientský JS 🟠
- 28 z 35 komponent má `'use client'`; kandidáti na server komponenty: `Footer`, `FooterBrand`, `FooterLinks`, `LocaleSwitcher` a další čistě prezentační.
- `src/hooks/useSafeScroll.ts` importuje framer-motion staticky na module-level — a přitom je hook **nepoužívaný** → smazat (viz R2), čímž se zruší i tento import.
- `@calcom/embed-react` — lazy-load přes dynamic import až při interakci s CTA.
**Akce:** Projít `'use client'` direktivy, přesunout statické komponenty na server, ověřit bundle přes `ANALYZE=true pnpm build`.

### P5 Souběžné nekonečné animace 🟡
8+ permanentních animací na homepage (border-glow na mnoha kartách, animate-ping, marquee, breathe/travel radiální pozadí). Na slabších mobilech riziko FPS dropů.
**Akce:** Spouštět animace až v viewportu (IntersectionObserver / `animation-play-state`), omezit `will-change` jen na skutečně animované prvky, doplnit `prefers-reduced-motion` pro `breathe`/`travel`/`border-glow` keyframes (teď ho nerespektují).

### P6 Caching 🟡
- Homepage: `revalidate: 60` + Payload/Mongo fetch — zvážit delší revalidate (3600) + webhook revalidaci, sníží cold starty na Netlify.
- Duplicitní/konfliktní hlavičky mezi `next.config.mjs` a `netlify.toml` — sjednotit na jedno místo (next.config), protože netlify.toml hlavičky se zjevně nedoručují (viz S0.3).

---

## 3. VYSOKÁ — Přístupnost (a11y)

### A1 Draggable partner loga nejsou přístupná z klávesnice 🔴
**Kde:** `src/components/ClientsSection.tsx` (fyzikální simulace) — loga jsou ovladatelná jen pointerem, nejsou fokusovatelná, žádná klávesová alternativa → porušení WCAG 2.1 A.
**Akce:** Minimálně: sekci označit jako dekorativní (`aria-hidden` na interaktivní vrstvě) a poskytnout přístupný seznam partnerů (sr-only nebo viditelný fallback). Ideálně fokusovatelné prvky + klávesové ovládání.

### A2 Kontrast textu pod WCAG AA 🟠
Nejhorší: `text-white/40` (2.0:1) — datum článku na blogu (`blog/[slug]/page.tsx`), texty ve footeru; `text-white/35` na blog listu.
**Akce:** Projít všechny `text-white/[..5][0-5]` a zvednout minimálně na `/60` pro běžný text (4.5:1), `/50` jen pro velký text.

### A3 Mobilní menu 🟡
**Kde:** `src/components/SiteNavbar.tsx` — toggle tlačítku chybí `aria-expanded` a `aria-controls`, menu nemá focus trap ani zavírání Escape.
**Akce:** Doplnit ARIA atributy, Esc handler, focus management.

### A4 Drobnosti 🟢
- `main id="main-content"` chybí na blog stránkách (skip-link tam nefunguje).
- GSAP animace (`useGSAPAnimation`) neověřují `prefers-reduced-motion`.
- ✅ FAQ accordion, newsletter formulář a skip-link jsou vzorově přístupné — bez akce.

---

## 4. STŘEDNÍ — Refaktoring a kvalita kódu

### R1 God-komponenty 🟠
| Komponenta | Řádků | Návrh |
|---|---|---|
| `ClientsSection.tsx` | 1151 | extrahovat `usePhysicsSimulation`, `BouncingBall`, layout config, pointer handlery |
| `HeroAnimated.tsx` | 589 | oddělit 3D logo, dekorace, pointer tracking |
| `ProcessSection.tsx` | 539 | oddělit GSAP orchestraci a responsive config |

### R2 Mrtvý kód 🟡
- Nepoužívané hooky: `useFAQs`, `useTeamMembers`, `useSafeScroll` (0 importů) → smazat.
- Nepoužívané assety v `public/`: `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` → smazat.

### R3 Datová vrstva 🟡
- Trojice souborů na entitu (`partners.ts` / `partners.server.ts` / fallback data) je matoucí; fallback data (references, team) duplikují obsah CMS a při výpadku CMS se zobrazí zastaralá kopie. → Konsolidovat do jednoho modulu na entitu, fallback řešit explicitně.

### R4 `typescript.ignoreBuildErrors: true` 🟠
**Kde:** `next.config.mjs:98`. Typecheck aktuálně prochází čistě (ověřeno) — flag je tedy zbytečný a jen maskuje budoucí regrese.
**Akce:** Odstranit flag; build tím získá typovou kontrolu zadarmo.

### R5 Toolchain nefunguje na aktuálním Node 🟠 (ověřeno)
- `pnpm dev` i `pnpm build` padají na Node 26 (`cross-env@10` a `scripts/build-payload-config.mjs` — CJS/ESM interop esbuild).
- Existuje `.nvmrc` (24.4.1), ale chybí `engines` v package.json a lokální prostředí ho nevynucuje.
**Akce:** Opravit esbuild import (`import pkg from 'esbuild'; const { build } = pkg;`), nahradit/aktualizovat cross-env (Node 20+ umí `NODE_OPTIONS` bez něj), přidat `"engines": { "node": ">=24 <25" }` + `engine-strict`.

### R6 Error/loading boundaries 🟢
Chybí `loading.tsx` pro streamované segmenty; Suspense fallbacky jsou prázdné divy → přidat skeleton loadery.

---

## 5. NÍZKÁ — Úklid a dokumentace

- [x] README: zdokumentovat dual-CMS (Payload = partneři/tým/reference/FAQ, Strapi = blog) a deployment flow.
- [x] Smazat/opravit `docs/security/secret-audit.md` (nepravdivý závěr).
- [x] `payload-audit.log`, `tsconfig.typecheck.tsbuildinfo` v rootu — přidat do .gitignore.
- [x] Zvážit `Cross-Origin-Resource-Policy` hlavičku.
- [x] Konsolidovat duplicitní "glass card" gradient overlay stacky (5 vrstev divů opakovaných v každé kartě) do sdílené komponenty.

---

## Fázový harmonogram

### Fáze 1 — Bezpečnost (dnes) 🔴
- [ ] Rotace všech 4 credentials + přesun do Netlify env UI (S0.1)
- [ ] `git rm --cached .env`, vyčistit `netlify.toml` a `.env.example` (S0.1)
- [ ] `pnpm update payload@latest ...` + `nodemailer` → `pnpm audit` znovu (S0.2)

### Fáze 2 — SEO + kritické UX (tento týden) 🔴
- [x] Oprava sitemap: odstranit mrtvé URL, přidat blog + hreflang (S1.1)
- [x] Rozhodnout osud `(site)` stránek — přesun pod [locale] nebo smazání (S1.1)
- [x] Odstranit/podložit aggregateRating (S1.2)
- [x] Server-rendered H1 v hero (S1.3)
- [x] Fix hero černé obrazovky při scroll-restoration (U1 — reveal animace musí mít fallback, např. CSS `animation` místo JS-added class, nebo timeout který `is-visible` přidá vždy)
- [x] CSP přes next.config headers (S0.3)

### Fáze 3 — Výkon (příští týden) 🟠
- [ ] Vypnout inlineCss + pick() messages → cíl: homepage HTML < 150 KB (P1)
- [ ] Komprese fotek týmu + sizes fix (P2)
- [ ] Font weighty (P3)
- [ ] 'use client' audit + lazy Cal.com (P4)
- [ ] Blog na ISR + webhook (S1.4)

### Fáze 4 — Přístupnost + refaktoring (průběžně) 🟡
- [x] Partner loga a11y (A1), kontrast (A2), mobilní menu (A3)
- [ ] Rozbít ClientsSection/HeroAnimated/ProcessSection (R1)
- [x] Smazat mrtvý kód (R2), odstranit ignoreBuildErrors (R4)
- [x] Fix toolchain pro Node 26 / pin engines (R5)

### Fáze 5 — Úklid a dokumentace 🟢
- [x] README, .gitignore, skeletony, CORP hlavička, glass-card komponenta

---

## Ověření po nasazení

1. `curl -s https://expandmatrix.com/en | wc -c` → cíl < 150 000
2. `curl -sI https://expandmatrix.com/en | grep -i content-security` → CSP přítomna
3. Sitemap: všechny URL vrací 200 bez redirectu
4. Google Rich Results Test na `/en` → 0 chyb (FAQ už opraveno, zbývá aggregateRating)
5. `pnpm audit --prod` → 0 critical/high
6. `git ls-files | grep .env` → prázdné
7. Lighthouse mobile (repo má připravené `mobile.config.js`): Performance > 85, A11y > 95
8. Hero viditelné okamžitě po načtení i po reloadu uprostřed stránky

---

### Příloha U1 — reprodukce hero bugu (ověřeno v Chrome na produkci)
1. Otevřít https://expandmatrix.com/en, scrollnout doprostřed stránky, reload (prohlížeč obnoví scroll pozici).
2. Scrollnout zpět nahoru → hero sekce je celá černá (nadpis, logo i CTA mají `opacity: 0`, `.hero-animated.is-visible` se nikdy nenastavila).
Dopad: uživatel vidí prázdnou obrazovku; stejný mechanismus zpožďuje LCP i při běžném načtení.
