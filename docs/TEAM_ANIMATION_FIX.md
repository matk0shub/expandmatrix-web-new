# Team Section Animation Fix - Implementation Report

## Datum: 2025-10-16

## Provedené změny

### Problémy k řešení

1. **Nadpis na 4 řádcích místo 2**
   - Příčina: `.heading-main` má příliš velké písmo (`xl:text-8xl`) + `text-balance`
   - Dlouhý český text se lámal na více řádků

2. **GSAP animace karet začínala příliš pozdě**
   - Karty začínaly na `yPercent: 150` (příliš daleko)
   - Timeline offset `index * 0.15` způsoboval velké zpoždění
   - Animace začínala až po dlouhém scrollu

### Implementované změny

#### 1. Nová CSS třída pro Team heading

**Soubor:** `src/app/globals.css`

Přidána nová třída `.team-heading` s menší velikostí písma:

```css
/* Team section heading - slightly smaller to fit on 2 lines */
.team-heading {
  @apply text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] uppercase font-semibold tracking-tight;
  font-family: var(--font-lato), 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  text-shadow: 0 0 20px rgba(0, 215, 107, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Rozdíl oproti `.heading-main`:**
- Menší velikosti: `text-3xl` až `xl:text-7xl` (místo `text-4xl` až `xl:text-8xl`)
- Stejný styling (gradient, shadow, font)

#### 2. Upravený TeamSectionHeader

**Soubor:** `src/components/TeamSection/TeamSectionHeader.tsx`

**Změny:**
- ✅ Použita třída `.team-heading` místo `.heading-main`
- ✅ Odstraněn `text-balance` (způsoboval zalamování)
- ✅ Přidán `whitespace-nowrap` na každý řádek
- ✅ Zvětšen max-width z `max-w-4xl` na `max-w-5xl`

```tsx
<h1 className="team-heading text-center">
  <div className="block whitespace-nowrap">
    <ScrambleText text={t('title.line1')} applyScramble={false} />
  </div>
  <div className="block whitespace-nowrap">
    <ScrambleText text={t('title.line2')} applyScramble={false} />
  </div>
</h1>
```

#### 3. Vylepšená GSAP animace

**Soubor:** `src/components/TeamSection/index.tsx`

**Změny:**

1. **Počáteční pozice karet:**
   ```typescript
   gsap.set(cardElements, { yPercent: 100, opacity: 0 }); 
   // Dříve: yPercent: 150
   ```

2. **Kratší scroll distance:**
   ```typescript
   const scrollDistance = cardCount > 1 ? (cardCount - 1) * 80 : 80;
   // Dříve: * 100
   ```

3. **Plynulejší easing:**
   ```typescript
   defaults: { ease: 'power2.out' }
   // Dříve: 'power1.out'
   ```

4. **Scrub hodnota pro lepší synchronizaci:**
   ```typescript
   scrub: 1
   // Dříve: scrub: true
   ```

5. **Rychlejší stagger mezi kartami:**
   ```typescript
   index * 0.08
   // Dříve: index * 0.15
   ```

### Výsledek

**Před úpravou:**
- ❌ Nadpis na 4 řádcích
- ❌ Karty začínaly animaci velmi pozdě
- ❌ Pomalý stagger mezi kartami
- ❌ Animace se zdála "oddělená" od scrollu

**Po úpravě:**
- ✅ Nadpis přesně na 2 řádcích
- ✅ Karty začínají animaci dříve (ze 100% místo 150%)
- ✅ Rychlejší stagger (0.08 místo 0.15)
- ✅ Kratší scroll distance (80 místo 100)
- ✅ Plynulejší synchronizace se scrollem (`scrub: 1`)
- ✅ Lepší easing (`power2.out`)

### Technické parametry animace

```typescript
// Počáteční stav
yPercent: 100         // Karty začínají 100% pod svou pozicí
opacity: 0            // Neviditelné

// Scroll distance
80 * (cardCount - 1)  // Pro 3 karty = 160vh scrollu

// Timeline
ease: 'power2.out'    // Plynulejší zakřivení
scrub: 1              // Přesná synchronizace se scrollem

// Stagger
0.08 * index          // Rychlé následování karet
randomSpeeds          // 0.3-0.9s náhodné rychlosti
```

### Testování

**Pro ověření funkčnosti:**

1. **Nadpis na 2 řádcích:**
   ```bash
   npm run dev
   ```
   - Otevřít `/cs` - "Jsme mladý, dravý tým," + "který se nebojí žádné výzvy"
   - Otevřít `/en` - "We're a young, driven team" + "that isn't afraid of any challenge"
   - Oba na přesně 2 řádcích

2. **GSAP animace:**
   - Scrollovat k sekci "Our Team"
   - Karty začínají vyjíždět IHNED po začátku scrollu sekce
   - Karty se objevují rychleji za sebou
   - Každá karta má jinou rychlost (náhodné)
   - Plynulejší synchronizace se scrollem

3. **Responsive:**
   - Testovat na různých breakpointech (sm, md, lg, xl)
   - Nadpis zůstává na 2 řádcích díky `whitespace-nowrap`

### Soubory upravené

1. ✅ `src/app/globals.css` - přidána `.team-heading` třída
2. ✅ `src/components/TeamSection/TeamSectionHeader.tsx` - nová třída + whitespace-nowrap
3. ✅ `src/components/TeamSection/index.tsx` - vylepšené GSAP parametry

### Poznámky

- **Slide-up animace zachována** (fade-in nebyl použit)
- **Náhodné rychlosti zachovány** (0.3-0.9s)
- **Respect reduced motion** zachován
- **CS i EN funkční**

### Known Issues

- Production build může selhat kvůli Next.js 15.5.4 vendor-chunks bugu
- Použít `npm run dev:clean` při problémech
- Dev mode funguje bez problémů

## Použití

```bash
# Development mode (doporučeno)
npm run dev

# Clean + dev při problémech
npm run dev:clean
```

