# Team Section Refactor - Implementační Report

## Datum: 2025-10-16

## Provedené změny

### 1. Refaktorace do modulární struktury

Původní monolitický soubor `TeamSection.tsx` (800 řádků) byl rozdělen do 7 logických souborů:

```
src/components/TeamSection/
├── index.tsx                    # Hlavní komponenta s GSAP orchestrací
├── types.ts                     # TypeScript typy
├── constants.ts                 # Konstanty a helper funkce
├── TeamSectionBackground.tsx    # Pozadí s animovanými glow spots
├── TeamSectionHeader.tsx        # Nadpis sekce
├── TeamCard.tsx                 # Karta jednotlivého člena
└── TeamCardsGrid.tsx           # Grid wrapper pro karty
```

### 2. Implementace GSAP pinování nadpisu

**Požadavek:** Nadpis "Our Team" se při scrollu připne na střed sekce a zůstane viditelný, zatímco karty vyjíždějí odspodu.

**Implementace v `index.tsx`:**
```typescript
// Pin nadpis v centru během scrollu
ScrollTrigger.create({
  trigger: section,
  start: 'top top',
  end: `+=${scrollDistance}%`,
  pin: header,
  pinSpacing: false,
  anticipatePin: 1,
});
```

### 3. Náhodné rychlosti vyjíždění karet

**Požadavek:** Každá karta vyjíždí ze spodní strany jinou rychlostí.

**Implementace v `index.tsx`:**
```typescript
// Generování náhodných rychlostí (0.3 až 0.9 sekundy)
const randomSpeeds = cardElements.map(() => 0.3 + Math.random() * 0.6);

// Animace karet s náhodnými rychlostmi
cardElements.forEach((card, index) => {
  timeline.to(
    card,
    {
      yPercent: 0,
      opacity: 1,
      duration: randomSpeeds[index],
    },
    index * 0.15 // Malý offset mezi kartami
  );
});
```

### 4. Řešení Error 500 - ENOENT

**Problém:** 
```
GET /cs 500 in 221ms
ENOENT: no such file or directory, open '.next/server/app/[locale]/page.js'
```

**Příčina:** Next.js 15.5.4 má známý bug s vendor-chunks v dev modu.

**Řešení:**
1. ✅ Vyčištění `.next` cache
2. ✅ Přidány clean scripty do `package.json`:
   ```json
   "clean": "rm -rf .next",
   "dev:clean": "npm run clean && npm run dev"
   ```
3. ✅ Workaround již přítomen v `next.config.ts` (řádky 67-101)

### 5. Build verification

- ✅ Production build úspěšný
- ✅ Žádné linter errory
- ✅ TypeScript kompilace bez chyb
- ✅ Všechny komponenty správně exportovány

## Použití

### Normální dev server:
```bash
npm run dev
```

### Dev server s vyčištěním cache (při Error 500):
```bash
npm run dev:clean
```

### Production build:
```bash
npm run build
npm start
```

## Testování

Pro ověření funkčnosti:

1. **GSAP pinování nadpisu:**
   - Otevřít stránku v browseru
   - Scrollovat k sekci "Our Team"
   - Nadpis by měl zůstat uprostřed během scrollu

2. **Náhodné rychlosti karet:**
   - Při scrollu sekce by měly karty vyjíždět zdola
   - Každá karta by měla mít jinou rychlost animace
   - Refresh stránky změní rychlosti (jsou náhodné)

3. **Error 500 fix:**
   - Server by měl běžet bez ENOENT errorů
   - Při problémech použít `npm run dev:clean`

## Výhody refaktorace

1. **Lepší maintainability:** Každá komponenta má jasnou odpovědnost
2. **Rychlejší development:** Snadnější navigace a úpravy
3. **Lepší testovatelnost:** Menší, izolované komponenty
4. **Reusabilita:** Komponenty lze snadno použít jinde
5. **Čistší kód:** Logické oddělení concerns

## Poznámky

- Původní soubor `TeamSection.tsx` byl smazán
- Import v `page.tsx` zůstal nezměněn (`@/components/TeamSection`)
- Všechny GSAP animace respektují `prefers-reduced-motion`
- Background s 28 glow spots zachován v plné funkčnosti

