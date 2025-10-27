# Consistency & Responsivity Audit Plan

## 🔍 Zjištěné Problémy

### 1. 🔴 ClientsSection (Our Partners) - Inconsistent Mobile Design

**Problém:**
- Na desktopu: Interaktivní fyzikální simulace s balls (cool efekt)
- Na mobile (<768px): Statický 3-column grid layout
- **Řádky 606-638:** Kompletně jiný render pro mobile

```tsx
if (isMobileDisabled) {
  return (
    <section>
      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        {ballConfigs.map((ball) => (
          <div className="...rounded-2xl...">  // ← Jiný design
            <span>{ball.icon}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Proč je to špatně:**
- Uživatel na mobile vidí úplně jiný design
- Ne-konzistentní UX
- Chybí hlavní nadpis/název sekce
- Malé karty v 3 sloupcích (těžké na kliknutí)

**Řešení:**
- Použít stejný vizuální styl na mobile
- Zachovat fyziku NEBO použít fallback se stejným vizuálním designem
- 2 columns místo 3 na mobile (větší touch targets)
- Přidat heading "Naši partneři" i na mobile

---

### 2. 🔴 ReferencesSection - Možné Problémy s Viditelností

**Analýza:**
Po našich úpravách (flex-col lg:flex-row):
- Mobile: Stack layout - reference list nahoře, stats card dole
- **Potenciální problém:** Na mobile může být vidět jen jedna reference kvůli výšce sekce

**Kontrolní body:**
```tsx
<div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-8 lg:py-0">
  <ReferenceList />  // ← Má max-h-[70vh] - může skrýt references
</div>
```

**ReferenceList.tsx řádek 50:**
```tsx
<div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
```

**Problém:**
- `max-h-[70vh]` na mobile může být příliš omezující
- Když je stack layout, reference list zabírá horní část
- Může být potřeba scroll, ale není jasné že tam jsou další references

**Řešení:**
- Zvětšit max-height na mobile: `max-h-[50vh] lg:max-h-[70vh]`
- Přidat vizuální indikátor scrollu
- Nebo odstranit max-height na mobile a nechat přirozený flow

---

### 3. 🟡 Border-Radius - Nekonzistence

**Audit všech border-radius hodnot:**

#### A) FAQSection
- Cards: `rounded-2xl` (16px)
- Button (plus icon): `rounded-full`
- Button (CTA): `rounded-full`

#### B) TeamSection
- Cards: `rounded-[32px]` (32px)
- Background blob: `rounded-[36px]` (36px)
- Focus tags: `rounded-full`
- Social buttons: `rounded-full`

#### C) ProcessSection
- Cards: `rounded-[4rem]` (64px) ← NEJVĚTŠÍ
- Gradient overlay: `rounded-[4rem]`
- Scan line: `rounded-[4rem]`
- Bottom accent: `rounded-b-[4rem]`
- Particles: `rounded-full`
- CTA button: `rounded-full`

#### D) ServicesSection
- Cards: `rounded-3xl` (24px)
- Left edge accent: `rounded-l-3xl`

#### E) ReferencesSection
- Section wrapper: `rounded-3xl` (24px)
- Stats card: `rounded-2xl lg:rounded-3xl` (16px/24px)
- Stats table: `rounded-2xl` (16px)
- ReferenceList buttons: `rounded-full`

#### F) ClientsSection
- Mobile cards: `rounded-2xl` (16px)
- Desktop balls: `rounded-full`
- Green circle: `rounded-full`

**Nalezené hodnoty:**
- `rounded-2xl` = 16px (FAQ cards, ClientsSection mobile, ReferenceStats)
- `rounded-3xl` = 24px (ServicesSection cards, ReferencesSection)
- `rounded-[32px]` = 32px (TeamSection cards)
- `rounded-[36px]` = 36px (TeamSection blob)
- `rounded-[4rem]` = 64px (ProcessSection cards) ← OUTLIER
- `rounded-full` = 50% (buttons, circles, particles)

**Doporučená standardizace:**
- **Malé prvky (buttons, tags):** `rounded-full`
- **Střední karty (FAQ, stats):** `rounded-2xl` (16px)
- **Velké karty (Services, Team):** `rounded-3xl` (24px)
- **Extra velké karty (Process):** `rounded-[2.5rem]` (40px) místo 64px
- **Sections:** `rounded-3xl` (24px)

---

### 4. 🟡 Typography Sizes - Readability Audit

#### Minimum Sizes Pro Čitelnost:
- Body text: **minimum 16px (text-base)**
- Small text: **minimum 14px (text-sm)**
- Extra small: **minimum 12px (text-xs)** - pouze pro labels/meta

#### Nalezené Problémy:

**A) TeamSection - Focus Tags**
```tsx
className="...text-xs sm:text-[0.65rem]..."  // ← 12px → 10.4px na SM+
```
- **PROBLÉM:** `text-[0.65rem]` = 10.4px je TOO SMALL
- **FIX:** Nechat `text-xs` (12px) na všech breakpointech

**B) FAQSection - Questions**
```tsx
className="text-lg md:text-xl"  // 18px/20px - OK
```
- ✅ Dobrá velikost

**C) ProcessSection - Description**
```tsx
className="text-base sm:text-lg md:text-xl lg:text-2xl"  // 16-24px
```
- ✅ Dobrá progrese

**D) ServicesSection - Description (hover text)**
```tsx
className="text-sm sm:text-base md:text-lg"  // 14-18px
```
- ⚠️ `text-sm` (14px) je minimum - OK, ale mohlo by být text-base

**E) ClientsSection Mobile**
```tsx
className="text-white/70 text-sm"  // 14px
```
- ⚠️ Malý text, měl by být `text-base` (16px)

**F) ReferenceList - Subtitle**
```tsx
className="mt-2 text-sm lg:text-base"  // 14-16px
```
- ✅ OK progrese

---

## 📋 IMPLEMENTAČNÍ PLÁN

### Branch Strategy
```bash
git checkout -b fix/consistency-and-responsivity
```

### Commit Structure
1. `fix(clients): improve mobile design consistency`
2. `fix(references): enhance mobile visibility`
3. `refactor: standardize border-radius across components`
4. `fix: improve text readability across all devices`
5. `test: verify consistency and responsivity`

---

### Krok 1: ClientsSection Mobile Redesign

**Soubor:** `src/components/ClientsSection.tsx`

**Změny:**

A) **Přidat heading na mobile** (řádek 620-624):
```tsx
<div className="text-center space-y-6 mb-8">
  <h2 className="heading-main text-balance text-white">
    <ScrambleText text={t('title')} applyScramble={false} />
  </h2>
</div>
```

B) **2 columns místo 3 na mobile** (řádek 626):
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
```

C) **Větší karty s lepším designem** (řádek 628-632):
```tsx
<div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 py-8 sm:py-10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-white/10 hover:border-white/20 transition-all duration-300">
  <span className="text-4xl sm:text-5xl">{ball.icon}</span>
</div>
```

D) **Zvětšit text** (řádek 623):
```tsx
<p className="text-white/70 text-base leading-relaxed">...</p>
```

---

### Krok 2: ReferencesSection Visibility Fix

**Soubor:** `src/components/ReferenceList.tsx`

**Změny (řádek 48-51):**
```tsx
<div className="space-y-6 max-h-[50vh] lg:max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
```

**Přidat scroll indicator:**
```tsx
{/* Scroll indicator - visible when more content */}
{references.length > 3 && (
  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none lg:hidden" />
)}
```

**Alternativa:** Použít carousel/swiper na mobile místo seznamu

---

### Krok 3: Border-Radius Standardization

**Změny:**

#### A) ProcessSection.tsx
```tsx
// Změnit z rounded-[4rem] (64px) na rounded-[2.5rem] (40px)
const CARD_CONFIG = {
  borderRadius: 'rounded-[2.5rem]',  // ← 40px místo 64px
  // ... rest
};
```

```tsx
// Update všechny instance:
- rounded-[4rem] → rounded-[2.5rem]
- rounded-b-[4rem] → rounded-b-[2.5rem]
```

#### B) TeamSection.tsx
```tsx
// Zachovat rounded-[32px] - je blízko 2.5rem (40px)
// NEBO změnit na rounded-[2.5rem] pro konzistenci
```

#### C) ClientsSection.tsx Mobile
```tsx
// Změnit z rounded-2xl na rounded-3xl
className="...rounded-3xl..."  // ← 24px místo 16px
```

---

### Krok 4: Typography Improvements

#### A) TeamSection.tsx - Focus Tags
```tsx
// Remove sm:text-[0.65rem], keep text-xs everywhere
className="rounded-full ... px-3 py-1 text-xs uppercase tracking-[0.26em] ..."
```

#### B) ClientsSection.tsx - Mobile Text
```tsx
// Zvětšit z text-sm na text-base
<p className="text-white/70 text-base leading-relaxed">...</p>
```

#### C) ServicesSection.tsx - Hover Description
```tsx
// Zvětšit z text-sm na text-base na mobile
className="text-white text-base sm:text-lg md:text-xl leading-relaxed..."
```

---

### Krok 5: Testing Checklist

**Responsivity Tests:**
- [ ] iPhone SE (375px) - ClientsSection 2 columns
- [ ] iPhone 12 Pro (390px) - všechny texty čitelné
- [ ] iPad Mini (768px) - 3 columns ClientsSection
- [ ] iPad Pro (1024px) - desktop layout
- [ ] Desktop (1920px) - full physics

**Visual Consistency:**
- [ ] Všechny border-radius konzistentní
- [ ] Font sizes readable na všech zařízeních
- [ ] Spacing konzistentní
- [ ] Colors matching

**References Section:**
- [ ] Na mobile viditelné všechny references
- [ ] Scroll indicator funguje
- [ ] Stats card viditelný
- [ ] Smooth transitions

---

## 🎯 OČEKÁVANÉ VÝSLEDKY

### ClientsSection
✅ Konzistentní design na mobile i desktopu  
✅ 2 columns na malém mobile (lepší UX)  
✅ Větší karty (48px+ touch targets)  
✅ Heading viditelný na mobile  
✅ Lepší readability  

### ReferencesSection
✅ Všechny references viditelné  
✅ Scroll indicator na mobile  
✅ Optimální max-height  
✅ Smooth UX  

### Border-Radius
✅ Standardizované hodnoty:
  - Buttons: `rounded-full`
  - Small cards: `rounded-2xl` (16px)
  - Medium cards: `rounded-3xl` (24px)
  - Large cards: `rounded-[2.5rem]` (40px)

### Typography
✅ Minimum 16px pro body text  
✅ Minimum 14px pro secondary text  
✅ Minimum 12px pro labels  
✅ Optimální progrese napříč breakpointy  

---

## 📊 FILES TO MODIFY

1. `src/components/ClientsSection.tsx` - Mobile redesign
2. `src/components/ReferenceList.tsx` - Visibility fix
3. `src/components/ProcessSection.tsx` - Border-radius standardization
4. `src/components/TeamSection.tsx` - Typography + optional border-radius
5. `src/components/ServicesSection.tsx` - Typography improvements

**Estimated Changes:** ~150 lines across 5 files









