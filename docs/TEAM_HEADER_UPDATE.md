# Team Section Header Update - Implementation Report

## Datum: 2025-10-16

## Provedené změny

### Požadavek
Upravit nadpis "Our Team" sekce tak, aby:
1. Byl rozdělen na 2 řádky
2. Byl připnutý na střed **sekce** (background), ne na viewport
3. Zůstal ve středu během scrollu, zatímco karty vyjíždějí okolo něj

### Implementace

#### 1. Aktualizace překladů (CS + EN)

**Soubor:** `src/messages/cs.json`
```json
"team": {
  "title": {
    "line1": "Jsme mladý, dravý tým,",
    "line2": "který se nebojí žádné výzvy"
  }
}
```

**Soubor:** `src/messages/en.json`
```json
"team": {
  "title": {
    "line1": "We're a young, driven team",
    "line2": "that isn't afraid of any challenge"
  }
}
```

#### 2. Úprava TeamSectionHeader komponenty

**Soubor:** `src/components/TeamSection/TeamSectionHeader.tsx`

**Změny:**
- ✅ Odstraněn `absolute positioning` (už není `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`)
- ✅ Přidán margin bottom pro oddělení od karet (`mb-20`)
- ✅ Nadpis rozdělen na 2 řádky s `title.line1` a `title.line2`
- ✅ Nadpis je součástí normálního flow sekce

```tsx
<div className="heading-wrapper z-20 pointer-events-none flex w-full max-w-4xl items-center justify-center px-6 mb-20 mx-auto">
  <h1 className="heading-main text-balance text-center">
    <div className="block">
      <ScrambleText text={t('title.line1')} applyScramble={false} />
    </div>
    <div className="block">
      <ScrambleText text={t('title.line2')} applyScramble={false} />
    </div>
  </h1>
</div>
```

#### 3. Úprava GSAP logiky

**Soubor:** `src/components/TeamSection/index.tsx`

**Změny:**
- ✅ Odstraněno samostatné pinování headeru pomocí `ScrollTrigger.create()`
- ✅ Odstraněna kontrola existence `header` elementu
- ✅ Sekce se pinne jako celek (nadpis + karty)
- ✅ Nadpis zůstává staticky ve středu sekce
- ✅ Karty vyjíždějí odspodu s náhodnými rychlostmi

**Layout sekce:**
```tsx
<div className="relative min-h-screen w-full flex flex-col items-center justify-center">
  {/* Header - staticky umístěný nahoře */}
  <TeamSectionHeader />
  
  {/* Karty - animují se zdola */}
  <div className="relative flex w-full items-center justify-center">
    <TeamCardsGrid members={spotlightMembers} locale={locale} />
  </div>
</div>
```

### Výsledek

**Před úpravou:**
- Nadpis na 1 řádku
- Nadpis pinnutý na střed viewportu (překrýval se s kartami)
- Nadpis byl vždy uprostřed obrazovky

**Po úpravě:**
- ✅ Nadpis na 2 řádcích
- ✅ Nadpis připnutý na střed sekce (background)
- ✅ Nadpis zůstává uprostřed sekce během scrollu
- ✅ Karty vyjíždějí odspodu pod nadpisem
- ✅ Celá sekce (nadpis + karty) se pinne jako jeden celek

### Build Status
- ✅ Production build úspěšný
- ✅ Žádné TypeScript errory
- ✅ Žádné linter errory
- ✅ CS i EN překlady fungují

### Testování

Pro ověření funkčnosti:

1. **2-řádkový nadpis:**
   - Otevřít `/cs` - nadpis "Jsme mladý, dravý tým," + "který se nebojí žádné výzvy"
   - Otevřít `/en` - nadpis "We're a young, driven team" + "that isn't afraid of any challenge"

2. **Pinování na střed sekce:**
   - Scrollovat k sekci "Our Team"
   - Nadpis je ve středu sekce (ne viewportu)
   - Během scrollu nadpis zůstává uprostřed sekce
   - Karty vyjíždějí zdola s náhodnými rychlostmi

3. **Animace karet:**
   - Každá karta má náhodnou rychlost (0.3-0.9s)
   - Refresh stránky změní rychlosti

### Soubory upravené

1. `src/messages/cs.json` - přidána struktura line1/line2
2. `src/messages/en.json` - přidána struktura line1/line2
3. `src/components/TeamSection/TeamSectionHeader.tsx` - 2-řádkový layout, statické umístění
4. `src/components/TeamSection/index.tsx` - upravena GSAP logika, odstraněno samostatné pinování headeru

### Poznámky

- Nadpis je nyní součástí normálního flow (ne absolute positioned)
- Celá sekce se pinne, takže nadpis i karty zůstávají na místě
- Responsive design zachován
- `prefers-reduced-motion` respektováno

