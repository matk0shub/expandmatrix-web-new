# Plán: pomalé první načtení expandmatrix.com (~5 s)

> Datum: 2026-07-07
> Symptom: po zadání `expandmatrix.com` do prohlížeče trvá ~5 s, než se cokoli stane; poté už web funguje okamžitě.
> Metodika: měření curl timing breakdownem proti produkci (studený i teplý stav), analýza hlaviček všech cache vrstev, inspekce kódu (middleware, layout, netlify.toml).

---

## 1. Diagnóza — změřeno na produkci

### Cesta požadavku, když napíšeš „expandmatrix.com"

```
(1) http://expandmatrix.com      → 301 https        ~0,3–0,5 s   (jen úplně první návštěva)
(2) https://expandmatrix.com/    → 307 /en          ~0,25–0,6 s  NIKDY necachováno (cf DYNAMIC)
                                   │  Cloudflare proxy → Netlify → Next MIDDLEWARE funkce
(3) https://expandmatrix.com/en  → 200 HTML
      Netlify Edge HIT  → ~0,3 s  ✅ (tohle zažíváš „pak už funguje skvěle")
      Netlify Edge MISS → origin Next funkce = COLD START → 2,8–5+ s  ❌
```

Naměřené hodnoty:

| Scénář | TTFB |
|---|---|
| Holá doména, edge miss (studený origin) | **2,76 s** (a to byl polostudený; plný cold start = 5 s+) |
| `/en` warm, Netlify Edge hit (10 vzorků) | 0,25–0,45 s ✅ |
| Samotný `/` 307 hop | 0,25–0,61 s, **při každé návštěvě** |
| http→https hop | 0,46 s |

### Proč origin trvá sekundy (cold start)

1. **Serverless funkce nese celý Payload CMS + MongoDB driver** — homepage funkce je obrovská; studený start ji celou načítá.
2. **`src/payload/prewarm.ts` importovaný v `[locale]/layout.tsx`** dělá `void getPayloadClient()` při načtení modulu → **každý cold start jakékoli stránky (i blogu, který Payload vůbec nepotřebuje) otevírá spojení na MongoDB Atlas** (SRV DNS + TLS + auth = 1–2 s).
3. Homepage navíc při renderu čeká na `getPartners()` → Payload → Mongo.

### Proč se cold start trefuje zrovna tebe

Edge cache okna jsou krátká: `s-maxage=600, stale-while-revalidate=600` → po **~20 minutách bez návštěv** je edge cache úplně prázdná a další návštěvník čeká synchronně na studený origin. Majitel webu, který se na web podívá párkrát denně, trefí studenou cestu **skoro pokaždé**. Běžný provoz (návštěvníci po sobě) drží cache teplou — proto to „pak už funguje skvěle".

### Zhoršující vrstvy

- **307 `/` → `/en` z middleware je principiálně necachovatelné** (redirect závisí na cookie + Accept-Language) → každé zadání holé domény = průchod Cloudflare → Netlify → middleware funkce navíc, i když je zbytek cachovaný.
- **Dvojité CDN**: Cloudflare proxy (`server: cloudflare`, `cf-cache-status: DYNAMIC` = HTML necachuje) před Netlify CDN — přidává hop, nepřidává cache.
- `netlify.toml` redirect `/ → /en 200 force` je Next runtimem ignorován (redirect reálně dělá middleware); `src/app/page.tsx` redirect je mrtvý kód (middleware vystřelí dřív).

---

## 2. Testovací plán (reprodukce a měření)

Skript (spustitelný kdykoli, uložit si výstupy před/po opravě):

```bash
FMT='dns:%{time_namelookup} tls:%{time_appconnect} ttfb:%{time_starttransfer} total:%{time_total} code:%{http_code}\n'
# a) plná cesta uživatele
curl -sL -w "$FMT" -o /dev/null https://expandmatrix.com
# b) jen redirect hop
curl -s -w "$FMT" -o /dev/null https://expandmatrix.com/
# c) distribuce warm TTFB (10×)
for i in $(seq 1 10); do curl -s -w '%{time_starttransfer}\n' -o /dev/null https://expandmatrix.com/en; sleep 2; done
# d) kdo odpověděl z cache
curl -sI https://expandmatrix.com/en | grep -iE 'cache-status|cf-cache|age'
```

Sledovat: `cache-status: "Netlify Edge"; hit|fwd=miss`, `cf-cache-status`, `age`.

## 3. Simulační plán (jak vyvolat studený stav)

1. **Po deployi** — každý deploy zahodí teplé funkce i edge cache → první request po deployi = plný cold start (nejsnazší repro).
2. **Idle > 25 minut** — nechat web bez requestů (s-maxage 600 + swr 600 vyprší), pak měřit (a).
3. Porovnat: cold TTFB vs. warm TTFB → cíl opravy je srovnat je k sobě.

---

## 4. Opravný plán (seřazeno podle dopad/riziko)

### F1 — Prodloužit cache okna homepage 🔴 dopad velký, riziko nulové
`next.config.mjs`: pro `/:locale(en|cs)` a `/:locale/:path*` zvýšit `s-maxage=3600, stale-while-revalidate=86400` (blog nechat 300). Edge pak **vždy** servíruje okamžitě (klidně stale) a revalidaci dělá na pozadí — sporadický návštěvník nikdy nečeká na origin. ISR `revalidate` homepage zvýšit z 60 na 3600; obsah z CMS se propíše do hodiny, nebo okamžitě přes F5.

### F2 — Vyhodit `prewarm` z layoutu 🔴 dopad velký, riziko malé
Smazat `import '@/payload/prewarm'` z `src/app/[locale]/layout.tsx` (příp. celý soubor). Spojení na Mongo se otevře lazy až při skutečné potřebě (data jsou stejně za `unstable_cache`); blog a legal stránky přestanou platit Mongo daň při cold startu úplně. Smazat i mrtvý redirect v `src/app/page.tsx` a ignorovaný `/ → /en` blok v netlify.toml (úklid, ať nemate).

### F3 — Cachovatelný redirect `/` → locale 🟠 dopad střední
Middleware u redirectu z `/` přidat `Cache-Control: public, max-age=3600` + `Netlify-Vary: header=accept-language,cookie=NEXT_LOCALE` — Netlify edge pak cachuje redirect per-jazyk a hop přestane chodit do funkce. (Fallback jednodušší varianta: trvalý 308 na `/en` bez personalizace — /en má language switcher a hreflang; rozhodnout dle preference.)

### F4 — Keep-warm ping 🟠 dopad okamžitý, workaround
Externí monitor (UptimeRobot / cron-job.org, zdarma) pingující `https://expandmatrix.com/en` a `/cs` každých 5 minut: drží funkci teplou i edge cache svěží. Nasadit hned — funguje i než se dodělá F1–F3; po nich klidně nechat jako bonus (má i uptime alerting).

### F5 — Cloudflare vrstva 🟡
Buď (a) přidat CF Cache Rule: cache HTML dle origin hlaviček + cache 3xx pro `/` (pak CF krájí latenci místo přidávání), nebo (b) přepnout DNS záznam na „DNS only" (šedý mráček) a nechat CDN práci Netlify. Pozn.: CF spravuje robots.txt content-signals — při (b) ověřit, že o ně nepřijdeme. + Přihlásit doménu na hstspreload.org (zruší http→https hop pro první návštěvy).

### F6 — Zmenšit funkci (volitelné, větší zásah)
Oddělit Payload z page-funkcí (data homepage přes tagovanou cache / build-time). Dělat jen pokud F1–F4 nedostačí.

---

## 5. PROFI CÍLOVÁ ARCHITEKTURA — „publish-driven static" (doporučeno)

F1–F5 jsou taktické záplaty. Robustní řešení, jak se tahle třída webů (marketing, obsah měněný párkrát týdně) staví profesionálně v 2026, stojí na principu: **návštěvník nikdy nečeká na render ani databázi — cache invaliduje publikace obsahu, ne hodiny.**

### Pilíře

1. **Statická distribuce s on-demand invalidací.** Všechny veřejné stránky prerendrované (build/ISR s `revalidate: false` = platné navždy) + invalidace `revalidateTag()` webhookem při změně v CMS. Žádná krátká TTL okna → žádný návštěvník nikdy nesynchronně nečeká na origin. Taggovaná `unstable_cache` i `/api/revalidate` endpoint už v repu existují — jen se plně nevyužívají.
2. **Databáze mimo request path.** Payload/Mongo se dotýká jen admin a revalidační běhy. Render čte výhradně cache. Cold start tím přestává být uživatelský problém (na funkci nikdo nečeká) a výpadek Manga web nepoloží (servíruje se poslední dobrá verze).
3. **Redirect na edge.** `/` → trvalý 308 na `/en`, cachovaný navždy; jazyk řeší hreflang + přepínač + `NEXT_LOCALE` cookie (respektovaná middlewarem pro vracející se uživatele). Auto-redirect podle `Accept-Language` je SEO/cache anti-pattern — zrušit.
4. **Jedna CDN vrstva.** Cloudflare přepnout na DNS-only; cache vlastní Netlify (rozumí Next ISR nativně). Dvě CDN s neslučitelnou invalidací = trvalý zdroj záhad.
5. **Kontinuální měření.** Synthetic check TTFB/uptime à 5 min s alertem (UptimeRobot/Checkly), RUM web-vitals od reálných uživatelů, Lighthouse CI budget v pipeline (configy v repu už jsou).

### Mapování na tento web

| Vrstva | Dnes | Cíl |
|---|---|---|
| Homepage/legal | ISR 60 s, krátká edge cache, cold start | prerender + cache navždy + `revalidateTag` z Payload `afterChange` hooků |
| Blog | ISR 300 s | `generateStaticParams` + Strapi webhook → existující `/api/revalidate` |
| `/` redirect | 307 middleware, necachovatelné | edge 308 → `/en`, cache navždy |
| Payload | Mongo connect při cold startu všech stránek | jen admin + revalidace |
| CDN | Cloudflare proxy + Netlify | Netlify only (CF DNS-only) |
| Monitoring | ad-hoc | synthetic à 5 min + RUM + Lighthouse CI |

### Implementační pořadí (nahrazuje/pohlcuje F1–F4)

1. **Krok P1 (kód):** odstranit prewarm z layoutu; homepage/legal na `revalidate: false` + Payload `afterChange`/`afterDelete` hooky volající `revalidateTag('partners'|'team'|'references'|'faqs')`; blog `generateStaticParams` + ověřit Strapi webhook; `/` redirect: middleware → 308 + cache hlavičky (s `Netlify-Vary: cookie=NEXT_LOCALE`), zrušit Accept-Language sniffing; úklid mrtvých redirectů.
2. **Krok P2 (kód):** delší `s-maxage`/`swr` jako pojistka nad on-demand invalidací; RUM (web-vitals → Plausible events) a Lighthouse CI job.
3. **Krok P3 (účty, uživatel):** Cloudflare DNS-only (ověřit robots.txt content-signals), UptimeRobot monitor, hstspreload.org.

## 6. Kritéria hotovo

- [ ] TTFB holé domény **< 400 ms kdykoli** — i po dnech bez návštěv (dnes ~3–5 s po 20 min idle)
- [ ] `/` redirect servírován z edge cache, žádná funkce v cestě
- [ ] Změna v Payload/Strapi se propíše do webu do ~30 s přes webhook (ne čekáním na TTL)
- [ ] Výpadek MongoDB nepoloží veřejný web (servíruje se cache)
- [ ] Blog/legal cold start bez Mongo připojení
- [ ] Synthetic monitor + alert aktivní; Lighthouse beze změny (≥ 83/95)
