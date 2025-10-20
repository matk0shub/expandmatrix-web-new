# Redesign Process Cards - Futuristický Styl

## Požadavky Uživatele

1. ✨ Více zakulacené rohy (větší border-radius)
2. 📝 Větší text (zvětšit všechny fonty)
3. 🎯 Karty více vystoupené do prostoru (3D depth effect)
4. 🚫 Odstranit zelené bordery
5. 💪 Tučnější text (bold font-weight)
6. 🚀 Moderní futuristický styl

## Designové Změny

### 1. Zakulacené Rohy
**Aktuálně:** `rounded-3xl` (24px)  
**Nově:** `rounded-[3.5rem]` (56px) nebo `rounded-[4rem]` (64px)

Ještě více zakulacené rohy pro sofistikovaný futuristický vzhled.

### 2. Větší Typography
**Aktuální velikosti:**
- Číslo kroku: `text-xs sm:text-sm` (12-14px)
- Nadpis: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` (30-60px)
- Popis: `text-sm sm:text-base md:text-lg lg:text-xl` (14-20px)

**Nové velikosti:**
- Číslo kroku: `text-base sm:text-lg md:text-xl` (16-20px) - +4-6px
- Nadpis: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl` (36-96px) - +6-36px
- Popis: `text-lg sm:text-xl md:text-2xl lg:text-3xl` (18-30px) - +4-10px

### 3. Tučnější Fonty
**Aktuálně:**
- Číslo: `font-bold` (700)
- Nadpis: `font-bold` (700)
- Popis: normální (400)

**Nově:**
- Číslo: `font-extrabold` (800)
- Nadpis: `font-extrabold` (800)
- Popis: `font-semibold` (600)

### 4. Odstranění Borderů
**Aktuálně:** `border-2 border-green-500/40`  
**Nově:** Žádný border - čistý glassmorphism efekt

### 5. 3D Depth Efekt - Karty Vystoupené
**Strategie pro futuristický 3D vzhled:**

#### A) Silnější Stíny (Multi-layer shadows)
```css
shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,215,107,0.3)]
hover:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_8px_24px_rgba(0,215,107,0.5)]
```

#### B) Transform Scale & Translate
```css
transform: translateY(-8px) scale(1.02)
hover:transform: translateY(-16px) scale(1.05)
```

#### C) Backdrop Blur + Glassmorphism
```css
backdrop-blur-2xl
bg-gradient-to-br from-black/90 via-black/95 to-black/98
```

#### D) Inner Glow & Outer Glow
```css
// Inner glow
box-shadow: inset 0 1px 0 rgba(255,255,255,0.1)

// Outer glow (zelený)
filter: drop-shadow(0 0 20px rgba(0,215,107,0.3))
```

### 6. Futuristické Detaily

#### A) Holografický Gradient Overlay
```css
background: linear-gradient(
  135deg,
  rgba(0,215,107,0.1) 0%,
  transparent 30%,
  rgba(0,255,120,0.05) 70%,
  transparent 100%
)
```

#### B) Animated Scan Lines
Jemné horizontální čáry pohybující se přes kartu (CSS animation).

#### C) Corner Accents
Svítící zelené tečky/čárky v rozích karty:
```html
<div class="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
<div class="absolute bottom-4 right-4 w-8 h-0.5 bg-gradient-to-r from-green-400 to-transparent" />
```

#### D) Glow Effect na čísle kroku
```css
text-shadow: 0 0 20px rgba(0,215,107,0.8)
```

## Implementační Změny

### Config Updates
```typescript
const CARD_CONFIG = {
  borderRadius: 'rounded-[4rem]',  // Zvětšeno z rounded-3xl
  typography: {
    number: {
      size: 'text-base sm:text-lg md:text-xl',
      weight: 'font-extrabold'
    },
    heading: {
      size: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
      weight: 'font-extrabold'
    },
    description: {
      size: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
      weight: 'font-semibold'
    }
  },
  effects: {
    shadow: 'shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,215,107,0.3)]',
    hoverShadow: 'hover:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_8px_24px_rgba(0,215,107,0.5)]',
    transform: 'translate-y-[-8px]',
    hoverTransform: 'hover:translate-y-[-16px]'
  }
};
```

### Card Styling
```typescript
const cardVariants = [
  `
    bg-gradient-to-br from-black/90 via-black/95 to-black/98
    backdrop-blur-2xl
    shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,215,107,0.3)]
    hover:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_8px_24px_rgba(0,215,107,0.5)]
    transition-all duration-700
  `,
  // ... stejné pro všechny karty
];
```

### Futuristické Detaily (HTML)
```html
<!-- Corner accents -->
<div class="absolute top-6 left-6 w-2 h-2 bg-green-400/80 rounded-full shadow-[0_0_12px_rgba(0,215,107,0.8)] animate-pulse" />
<div class="absolute top-6 right-6 w-2 h-2 bg-green-400/80 rounded-full shadow-[0_0_12px_rgba(0,215,107,0.8)] animate-pulse" />
<div class="absolute bottom-6 left-6 w-12 h-0.5 bg-gradient-to-r from-green-400 to-transparent" />
<div class="absolute bottom-6 right-6 w-12 h-0.5 bg-gradient-to-l from-green-400 to-transparent" />

<!-- Holographic overlay -->
<div class="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/5 opacity-50 rounded-[4rem] pointer-events-none" />

<!-- Scan line effect -->
<div class="absolute inset-0 overflow-hidden rounded-[4rem] pointer-events-none">
  <div class="scan-line absolute w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
</div>
```

### CSS Animation for Scan Line
```css
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

.scan-line {
  animation: scan 8s linear infinite;
}
```

## Výsledný Look & Feel

### Charakteristiky
✨ Ultra zakulacené rohy (64px)  
💪 Tučné, výrazné fonty (extrabold)  
📐 Větší, čitelnější text (+30-50%)  
🎯 Silný 3D depth efekt  
🌟 Glassmorphism s holografickým overlay  
⚡ Futuristické corner accents  
💫 Jemné scan line animace  
🚫 Žádné bordery - čistý design  

### Inspirace
- Cyberpunk UI
- Sci-fi hologramy
- Apple Vision Pro interface
- Tesla dashboard
- Modern gaming UI

## Implementační Kroky

1. ✅ Update CARD_CONFIG (rohy, typography, efekty)
2. ✅ Odstranit bordery z cardVariants
3. ✅ Přidat multi-layer shadows
4. ✅ Zvětšit všechny fonty o 1-2 velikosti
5. ✅ Změnit font-weight na extrabold/semibold
6. ✅ Přidat holografický gradient overlay
7. ✅ Přidat corner accents (glowing dots + lines)
8. ✅ Přidat scan line animaci
9. ✅ Update transform efekty (translate-y)
10. ✅ Test na všech zařízeních

