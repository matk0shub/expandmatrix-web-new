# Redesign plán — sekce Reference (FINÁLNÍ, rozhodnuto)

> Datum: 2026-07-07
> Rozsah: kompletní vizuální i strukturní redesign sekce „Reference" na homepage (`#references`).
> Metodika: analýza kódu + vizuální audit živé produkce (desktop 1440px + mobil) + ověření datové vrstvy (Payload).
> Status: **všechna designová rozhodnutí učiněna** (viz §2). Tenhle dokument je implementační zadání, ne diskuse.
> Cíl: sekce přestane působit jako „náhodný zelený box v černé stránce" a začne fungovat jako přesvědčivý case-study důkaz plně zapadající do konceptu webu (černá + brand zelená `#00d76b`, full-bleed sekce, `heading-main`, `GlassCardOverlays`).

---

## 1. Diagnóza — proč to teď vypadá špatně

Ověřeno na produkci (`https://expandmatrix.com/en#references`) a v kódu:

| # | Problém | Kde | Dopad |
|---|---|---|---|
| D1 | **Sekce je tvrdě ohraničený zaoblený obdélník** (`rounded-[48px]`) s tmavě zeleným radiálním gradientem (`#07120c`, zelené radiály), plovoucí uvnitř jinak čistě černé stránky. Jako jediná sekce na webu není full-bleed. | `ReferencesSectionClient.tsx:127-154` | 🔴 **Hlavní stížnost** — vypadá jako omylem vložený zelený panel |
| D2 | **Chybí velký nadpis sekce.** Všechny ostatní sekce mají `heading-main` H2 (OUR SERVICES, COOPERATION PROCESS, TEAM, FAQ). Reference mají jen drobný overline „REFERENCE". | `ReferencesSectionClient.tsx:163-165` | 🟠 Působí nedokončeně, rozbíjí rytmus stránky |
| D3 | **Off-brand barvy.** Instagram tlačítko `bg-blue-600` (modrá), stats karta glow `from-blue-500/10 via-purple-500/5 to-blue-500/10` (modro-fialová). Web je striktně zeleno-černý. | `ReferenceList.tsx:164`, `ReferenceStatsCard.tsx:116` | 🟠 Barevný nesoulad, působí lacině |
| D4 | **Stats karta „AI Impact Overview" vypadá jako rozbitá tabulka.** Glass `bg-white/12`, neaktivní řádky ztmavené, při přepínání reference hodnoty mizí (fade). Generický nadpis. | `ReferenceStatsCard.tsx:46-112` | 🟠 Klíčový důkaz (čísla) je prezentován nejslabším způsobem |
| D5 | **Obrovské mrtvé místo.** Sekce má na desktopu ~736px výšky, ale obsah (3 reference + 4 metriky) zabírá zlomek. | `py-32`, `min-h`, layout | 🟡 Působí poloprázdně |
| D6 | **Nevyvážený layout.** Levý sloupec nahoře, pravá karta svisle na střed → nakřivo. Neaktivní reference na `opacity-50` skoro neviditelné. | `ReferencesSectionClient.tsx:161-192`, `ReferenceList.tsx:85` | 🟡 Nevyváženo, půl obsahu „zmizí" |
| D7 | **Nekonzistentní logo-chipy.** Obrázky jsou fotky oříznuté na čtverec (`object-cover`), ne jednotné brand marky. Komentář tvrdí „square brand mark", data ukazují fotky. | `ReferenceList.tsx:109-125`, `data/references.ts` | 🟡 Vizuálně roztříštěné |
| D8 | **Gimmicky interakce.** Aktivní reference = scramble efekt + zvětšení fontu; auto-rotace 6,5s. Rozptyluje. | `ReferenceList.tsx:128-137` | 🟢 Nice-to-have, ne blocker |

**Jádro:** sekce ignoruje designový systém webu (full-bleed černé sekce + `heading-main` + zelený akcent + `GlassCardOverlays`), který u Services/Process/Team funguje dobře. Vznikla jako izolovaný experiment s vlastním boxem a cizími barvami.

---

## 2. Rozhodnutí (učiněno, závazné)

| # | Otázka | ROZHODNUTÍ | Proč |
|---|---|---|---|
| R-a | **Nadpis** | overline `REFERENCE` + H2 **„Výsledky, ne sliby"** (EN: „Results, not promises") + 1řádkový podtitul | Sedí do brand voice „Accuracy, transparency **and results**"; `heading-main` je uppercase → vykreslí `VÝSLEDKY, NE SLIBY`. Sebevědomé, důkazně laděné. |
| R-b | **Loga** | Komponenta `ClientLogo` s **monogramem (iniciály na brand-tinted dlaždici) jako deterministickým základem** + volitelným reálným logem (`object-contain` na neutrálním skle), které monogram přebije, když existuje asset. Ship s monogramy. | Nejrobustnější: vzhled nezávisí na tom, jestli máme čistá loga. Reálná loga se doplní přes CMS/data kdykoli později bez změny layoutu. Odstraní roztříštěné fotky (D7). |
| R-c | **Layout** | **Varianta A** — velká case-study karta pro aktivní referenci + řada přepínacích chip-tabů (všichni klienti viditelní). Komponenta i data navržené tak, aby přechod na 3-up grid byl levný, kdyby referencí přibylo. | Zaplní prostor (D5), case-study framing je přesvědčivější, nic nemizí na opacity 50 % (D6). Pro 3–5 referencí ideál. |
| R-d | **Data** | **Zdroj = Payload kolekce `references`** přes existující `getReferences({locale})` (jako partners/team), s hardcoded sample daty jako typovaný fallback, když je CMS prázdné. Přidat pole `sector` do kolekce, typu, serveru i fallbacku. | Konzistence s partners/team (ty už jedou z Payloadu) = zapadá do konceptu. Reference editovatelné bez deploye. Fallback zajistí, že sekce nikdy není prázdná. |
| R-e | **Sektor tagy** | **Ano**, u každé reference — mapují na 3 služby webu: Apex MMA Gym → **„Web"**, Tarifix.cz → **„Automatizace"**, Pendler Finance → **„AI agent + Web"** (EN: „Website" / „Automation" / „AI agent + Web") | Rychlý kontext oboru + elegantně zrcadlí trojici služeb (AI agenti / weby / AI implementace). |

---

## 3. Designová vize

**Koncept: „Výsledky, ne sliby" — case-study důkazní pás.**

Reference přestanou být plovoucí panel a stanou se plnohodnotnou full-bleed sekcí ve stejném jazyce jako zbytek webu: černé pozadí s jemným zeleným ambientním svitem u okrajů (ne tvrdý box), velký nadpis, a čísla klientů jako hrdý zelený důkaz.

Vodicí principy:
1. **Full-bleed, žádný box** — pozadí splyne s černou stránkou; brand svit jen jako měkké radiály za obsahem, prosvítající do ztracena (vzor ze `ServicesSection`/`FAQSection`).
2. **Konzistence se systémem** — `heading-main` nadpis, `GlassCardOverlays` na kartách, zelený akcent `#00d76b`, `AnimatedReveal` vstup, rytmus `py-24 md:py-40 lg:py-48`.
3. **Čísla jsou hrdina** — metriky klienta jako velká zelená čísla, vždy čitelná, nikdy nemizí.
4. **Vyváženost** — dva sloupce stejně těžké, žádné poloprázdné plochy, žádné neviditelné položky.
5. **Brand-only barvy** — zelená + neutrální sklo + bílá. Žádná modrá/fialová.

---

## 4. Layout (Varianta A) — Featured case-study + selektor

```
┌─ SEKCE (full-bleed černá, jemný zelený svit u okrajů) ──────────────┐
│                                                                     │
│   REFERENCE                                    (overline, zelená)   │
│   Výsledky, ne sliby                (heading-main H2, velký)        │
│   Reálné projekty a čísla, která přinesly.  (podtitul)             │
│                                                                     │
│   ┌─ CASE-STUDY KARTA (GlassCardOverlays, zaoblená, zelený akcent)─┐│
│   │  ┌─────────────┐   Apex MMA Gym                    [ Web ]     ││
│   │  │  LOGO/mono  │   Professional MMA Gym & Academy…  (sektor)   ││
│   │  │   72px      │   [ Web ]  [ Instagram ]   (brand tlačítka)   ││
│   │  └─────────────┘                                               ││
│   │  ───────────────────────────────────────────────────────────  ││
│   │   CO JSME DODALI                                               ││
│   │   ┌──────────────┬──────────────┐                             ││
│   │   │ 0 → full web │  +320 návštěv │   ← velká ZELENÁ čísla     ││
│   │   │ New online…  │  Organic traf…│      malé bílé/70 labely   ││
│   │   ├──────────────┼──────────────┤                             ││
│   │   │    +27%      │   96 / 100    │                             ││
│   │   │ New members  │  Lighthouse   │                             ││
│   │   └──────────────┴──────────────┘                             ││
│   └───────────────────────────────────────────────────────────────┘│
│                                                                     │
│   ● Apex MMA Gym   ○ Tarifix.cz   ○ Pendler Finance   (chip taby)   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Desktop:** case-study karta max-w ~980px na střed (nebo mírně doleva), pod ní vodorovná řada chip-tabů. Uvnitř karty dvě zóny: identita klienta (logo + jméno + subtitle + sektor + odkazy) nahoře, oddělovač, metriky 2×2 dole.

**Mobil:** stejná karta na plnou šířku, metriky 2×2 (na < 380px 1 sloupec), selektor jako řada chipů pod kartou (scrollovatelná, když se nevejde) + swipe. Chevrony volitelně.

### Varianta B (evidováno, nezvoleno)
3-up grid rovnocenných karet (jako Services/Team). Levnější na škálování při >5 referencích. Komponenta se navrhne tak, aby přechod A→B nevyžadoval přepis datové vrstvy.

---

## 5. Vizuální systém — konkrétní specifikace

### Pozadí sekce (řeší D1)
- Odstranit `rounded-[…]` container i `overflow-hidden` box a zelený gradientní fill.
- Sekce = `<section class="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48">`.
- Ambientní svit: 2–3 měkké radiály `rgba(0,215,107, 0.10–0.18)` `blur-3xl` u okrajů, prosvítající do ztracena (vzor z `ServicesSection`/`FAQSection`). Žádná viditelná hrana.

### Nadpis (řeší D2)
- Overline: `text-[#00d76b]` malý uppercase, text `overline` z messages.
- H2: `heading-main` — nový string `heading` = „Výsledky, ne sliby" / „Results, not promises".
- Podtitul: 1 věta jako u ostatních sekcí, string `subtitle`.

### Case-study karta (řeší D4, D6)
- Povrch: `rounded-3xl` + `<GlassCardOverlays>` (sdílená komponenta) → konzistence se Services/Process/Team.
- Spodní zelený akcent bar (`from-[#00d76b] to-[#00b85c]`) jako ostatní karty.
- Rozdělení: identita klienta / oddělovač `border-white/10` / „CO JSME DODALI" + metriky.

### Metriky (řeší D4)
- 2×2 grid na všech breakpointech (na < 380px 1 sloupec).
- Hodnota: `text-3xl lg:text-4xl font-black text-[#00d76b]` (velká zelená čísla).
- Label: `text-xs uppercase tracking-wide text-white/60` (AA, po serve #3).
- Vždy plně viditelné — žádné per-řádek ztmavení, žádné mizení při přechodu (fade jen celé karty).
- Nadpis „AI Impact Overview" → `deliveredHeading` = „Co jsme dodali" / „What we delivered".

### `ClientLogo` komponenta (řeší D7, R-b)
- Props: `logoUrl?`, `name`, `sector?`.
- Když `logoUrl` existuje: `next/image` `object-contain` na `bg-white/5 ring-1 ring-white/10 rounded-2xl` dlaždici 72px (logo dýchá, není oříznuté).
- Když ne: **monogram** — iniciály z `name` (1–2 znaky) na `bg-[#00d76b]/12 text-[#00d76b] ring-1 ring-[#00d76b]/25 rounded-2xl`, `font-black`. Deterministické, vždy hezké.
- Server-safe (bez `use client`).

### Odkazy / tlačítka (řeší D3)
- Instagram: `bg-blue-600` → zelený outline `border-[#00d76b]/40 text-[#00d76b] hover:bg-[#00d76b]/10` (ikona zůstává).
- Web: stejný styl, konzistentní.
- Odstranit modro-fialový glow ze stats karty.

### Sektor-tag (R-e)
- Malý chip u jména: `border-[#00d76b]/30 bg-[#00d76b]/10 text-[#00d76b] text-xs uppercase tracking-wide rounded-full px-3 py-1`. Text ze `sector`.

---

## 6. Interakce a stav (řeší D8)

- **Selektor:** řada klikacích chip-tabů (desktop i mobil), aktivní = zelený plný, ostatní = sklo. Nahrazuje dim-seznam.
- **Auto-rotace:** ponechat, ale 8s, stop při hover/focus/interakci (touch už stopuje). Respektovat `prefers-reduced-motion`.
- **Přechod karty:** jemný cross-fade + drobný posun celé karty (ne per-element scramble). **Scramble na jméně zrušit.**
- **Klávesnice:** šipky ↑↓/←→ přepínají (funguje), chipy `role="tab"` + `aria-selected`, focus-visible zelený ring.
- **Swipe:** ponechat na mobilu.

---

## 7. Datová vrstva (R-d) — konkrétní kroky

1. `src/payload/collections/References.ts` — přidat pole `sector` (dual-locale text, volitelné) vedle `subtitle`.
2. `src/types/references.ts` — přidat `sector?: string` do `Reference`.
3. `src/data/references.server.ts` — namapovat `sector` z Payload dokumentu; `getReferences({locale})` už existuje a cachuje.
4. `src/data/references.ts` (sample fallback) — přidat `sector` k Apex/Tarifix/Pendler (viz R-e); ponechat jako fallback.
5. `src/components/ReferencesSection.tsx` — volat `getReferences({locale})` (Payload) místo `getSampleReferences`; když vrátí prázdno, použít `getSampleReferences(locale)` jako fallback (try/catch, aby výpadek CMS neshodil homepage). Doplnit nové copy klíče.
6. `payload-types.ts` je generovaný — po přidání pole regenerovat standardním skriptem (NE ručně editovat).

Datový kontrakt (`Reference`) se jinak nemění → redesign je čistě prezentační + jedno nové pole.

---

## 8. Přístupnost a výkon (nesmí regredovat po serve #1–#4)

- Kontrast: všechny texty ≥ `white/60`; zelená čísla `#00d76b` na černé ~6:1 ✅.
- Sémantika: zachovat `itemScope itemType="schema.org/ItemList"` + per-reference `schema.org/Organization`/`ItemListElement`. Zvážit `CreativeWork`/case-study markup.
- Klávesnice + `aria-selected` na tabech + `aria-live="polite"` na oblasti karty (oznámí změnu čtečce).
- `prefers-reduced-motion`: bez auto-rotace, bez posunů, okamžité přepnutí.
- Obrázky: `next/image`, loga 72px, přesné `sizes`, `loading="lazy"` (pod foldem).
- Bez nových závislostí; framer-motion zůstává lazy (`useFramerMotion('idle')`).
- **Lighthouse nesmí spadnout pod 84 mobile / 95 desktop.**

---

## 9. Dotčené soubory a rozsah

| Soubor | Změna | Odhad |
|---|---|---|
| `src/components/ReferencesSectionClient.tsx` | Přepis: full-bleed sekce, heading-main, featured layout + chip selektor, pryč box/gradient | velká |
| `src/components/ReferenceStatsCard.tsx` | Přepis na 2×2 zelený metrics grid, pryč modro-fialový glow, vždy viditelné hodnoty, nový nadpis | střední |
| `src/components/ReferenceList.tsx` | Zjednodušit na chip selektor + identitu klienta; brand tlačítka; pryč scramble; použít `ClientLogo` | velká |
| `src/components/ClientLogo.tsx` | **Nový** — logo/monogram (server-safe) | malá |
| `src/components/ReferencesSection.tsx` | Payload data + fallback, nové copy klíče | malá |
| `src/components/GlassCardOverlays.tsx` | Reuse bez změny | — |
| `src/messages/{cs,en}.json` | `heading`, `subtitle`, `deliveredHeading`, `sector` per ref; přejmenovat `impactHeading` | malá |
| `src/data/references.ts` | `sector` do sample dat | malá |
| `src/data/references.server.ts` | Mapovat `sector` | malá |
| `src/types/references.ts` | `sector?: string` | malá |
| `src/payload/collections/References.ts` | Pole `sector` | malá |

**Mimo rozsah:** velký refaktor jiných sekcí, změna designu partners/team.

---

## 10. Fázový postup (implementace přes sous-chef:serve, 2 talíře)

**Talíř 1 — struktura + karta (řeší D1, D2, D4, D5, D6, D3-část):**
1. Full-bleed sekce + heading-main + ambient svit; pryč box/gradient.
2. Case-study karta s `GlassCardOverlays` + 2×2 zelený metrics grid; pryč modro-fialový glow.
3. Payload data + sample fallback; `sector` napříč vrstvou; nové copy CS/EN.
→ Sama o sobě odstraní hlavní stížnost.

**Talíř 2 — selektor + polish (řeší D8, D6, D3-zbytek, D7):**
4. Chip selektor místo dim-seznamu; brand tlačítka; pryč scramble; `ClientLogo` (logo/monogram); jemný cross-fade.
5. `sector` chipy, sjednocení log.

**Verifikace (po každém talíři):** `pnpm typecheck && lint && build`; vizuální kontrola desktop + mobil (screenshot); Lighthouse (≥ 84/95); a11y (kontrast, klávesnice, čtečka, reduced-motion). Cross-model taste review na hydration/vizuální korektnost.

---

## 11. Kritéria hotovo

- [ ] Sekce je full-bleed černá, žádný viditelně ohraničený zelený box.
- [ ] `heading-main` nadpis „Výsledky, ne sliby" + podtitul, konzistentní s ostatními sekcemi.
- [ ] Žádná modrá/fialová — jen zelená `#00d76b` + neutrální sklo + bílá.
- [ ] Metriky = velká zelená čísla, vždy čitelná, 2×2 grid, AA kontrast.
- [ ] Levý i pravý obsah vyvážený, žádné poloprázdné plochy, žádné položky na opacity 50 %.
- [ ] Loga jednotná přes `ClientLogo` (reálné logo `object-contain` nebo monogram fallback).
- [ ] Sektor tagy (Web / Automatizace / AI agent + Web) u referencí.
- [ ] Data z Payloadu s funkčním sample fallbackem; `sector` napříč vrstvou.
- [ ] Klávesnice + čtečka + `prefers-reduced-motion` OK; SEO ItemList markup zachován.
- [ ] Lighthouse ≥ 84 mobile / 95 desktop; `typecheck`/`lint`/`build` zelené.
