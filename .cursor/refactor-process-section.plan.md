# Refactor Process Section - Komplexní Plán

## Aktuální Problémy

### 1. Složitá Logika Kódu
**Řádky 14-300**: Celý Vector/GravityPoint/Particle systém
- 400+ řádků komplexní fyzikální logiky
- Těžko udržovatelné
- Canvas rendering system
- Může způsobovat performance issues na slabších zařízeních

### 2. Špatný Design Karet
**Řádky 320-329**: Karty design
```typescript
w-[720px] h-[580px]  // Fixed rozměry - NEresponzivní!
from-slate-800/80 to-slate-700/80  // Šedivé karty - nesedí do zeleného layoutu
```
- Šedivé karty nezapadají do zeleného brand designu
- Fixed width/height je špatné pro mobile/tablet
- Karty vypadají "staře"

### 3. Nulová Responzivita
**Řádek 788**: Karty nemají responzivní breakpointy
- Fixed `w-[720px]` nebude fungovat na mobile
- Fixed `h-[580px]` nebude fungovat na malých obrazovkách
- Chybí mobile/tablet/desktop varianty

### 4. Nepřehledná Struktura
- Všechno v jednom souboru (827 řádků)
- Žádný konfigurační objekt
- Hard-coded hodnoty všude
- Těžko se upravují rozměry

## Refaktoringový Plán

### Krok 1: Vytvořit CARD_CONFIG
Přidat centralizovaný config objekt (podobně jako u ServicesSection):
```typescript
const CARD_CONFIG = {
  width: {
    base: 'w-full',           // Mobile: full width
    sm: 'sm:w-[90%]',         // Tablet: 90%
    lg: 'lg:w-[720px]',       // Desktop: fixed
    xl: 'xl:w-[780px]'        // Large: větší
  },
  height: {
    base: 'min-h-[480px]',    // Mobile: min-height
    sm: 'sm:min-h-[520px]',   // Tablet
    md: 'md:min-h-[560px]',   // Desktop
    lg: 'lg:h-[580px]'        // Large: fixed
  },
  padding: {
    base: 'p-8',
    sm: 'sm:p-10',
    md: 'md:p-12',
    lg: 'lg:p-16'
  },
  borderRadius: 'rounded-3xl',
  maxWidth: 'max-w-[90vw] lg:max-w-none'
};
```

### Krok 2: Modernizovat Design Karet
Přepsat karty na moderní zelený design se zachováním GSAP efektu:

**Nový design:**
- Černé pozadí s gradient border (zelená)
- Hover efekty se zeleným glow
- Subtlní backdrop blur
- Číslo kroku ve velkém fontu (moderní)
- Clean typography
- Accent prvky (zelená čára, glowy)

**Příklad nového stylu:**
```typescript
const cardVariants = [
  'bg-black/95 border-2 border-green-500/40 hover:border-green-400/60',
  'bg-black/95 border-2 border-green-500/40 hover:border-green-400/60',
  // ... pro každou kartu
];
```

### Krok 3: Zjednodušit Canvas Background
**Možnost A (Doporučená)**: Zjednodušit canvas efekt
- Ponechat základní particle systém
- Odstranit složitou gravitační fyziku
- Jednodušší, ale stále efektní

**Možnost B**: Nahradit CSS animacemi
- Animované gradient bloby
- CSS keyframe animace
- Lepší performance

### Krok 4: Implementovat Plnou Responzivitu
Přidat responzivní třídy do všech prvků:

**Karty:**
- Mobile (base): full width, min-height, menší padding, menší font
- Tablet (sm/md): 90% width, střední padding
- Desktop (lg+): fixed width, plný padding

**Typography:**
- Číslo kroku: `text-sm sm:text-base md:text-lg`
- Nadpis: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl`
- Popis: `text-base sm:text-lg md:text-xl`

### Krok 5: Refaktorovat Strukturu Kódu
Reorganizovat do jasných sekcí:

```typescript
// 1. Imports & Types
// 2. Configuration (CARD_CONFIG)
// 3. Helper Functions (pokud potřeba)
// 4. Main Component
//    a) Data (steps array)
//    b) Canvas Effect (zjednodušený)
//    c) GSAP ScrollTrigger setup
//    d) Render (JSX)
```

### Krok 6: Optimalizovat GSAP Animace
Zjednodušit GSAP setup:
- Použít config hodnoty místo hard-coded
- Cleaner trigger logika
- Lepší performance

### Krok 7: Vylepšit Karty Layout
**Nová struktura karty:**
```
<div> // Card wrapper - responzivní rozměry
  <div> // Card container - border, bg, hover
    <div> // Content wrapper - padding, flex
      <div> // Top section
        <span> // Číslo + čára
        <h3>   // Nadpis
      </div>
      <div> // Middle section
        <p>    // Popis
      </div>
      <div> // Bottom accent (modern corner glow)
    </div>
  </div>
</div>
```

## Očekávané Výsledky

### Design
✅ Moderní černé karty se zeleným accentem  
✅ Čisté, minimalistické  
✅ Zapadají do celkového brand designu  
✅ Smooth hover efekty s glow  

### Responzivita
✅ Perfektní na mobile (320px+)  
✅ Optimalizované pro tablet (768px+)  
✅ Plná síla na desktop (1024px+)  
✅ Dynamické rozměry podle viewport  

### Kód
✅ 50% méně řádků kódu  
✅ Jasná struktura  
✅ Snadná konfigurace  
✅ Lepší performance  
✅ Udržovatelný  

### Funkčnost
✅ GSAP stacking efekt zachován  
✅ Canvas background (zjednodušený nebo CSS)  
✅ Funguje v CS i EN  
✅ Accessibility zachována  

## Technické Detaily

### Responzivní Breakpointy
- **Mobile**: 320px - 639px (base)
- **Tablet**: 640px - 1023px (sm, md)
- **Desktop**: 1024px+ (lg, xl)

### Color Palette
- Background: `bg-black/95`
- Border: `border-green-500/40` → `hover:border-green-400/60`
- Text: `text-white` / `text-white/80`
- Accent: Zelená `#00d76b` / `#00e673`
- Glow: `shadow-green-500/20`

### Typografie
- Nadpisy: Lato Bold, tight tracking
- Body: Lato Regular, relaxed leading
- Čísla: Mono font pro technický vzhled

### Animace
- GSAP: Stacking cards (zachováno)
- Hover: Scale 1.05, rotate 0, glow appear
- Entrance: Fade + slide (smooth)

