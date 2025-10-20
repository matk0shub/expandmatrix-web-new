# Responsive & SEO Audit - References, Team & FAQ Sections

## 🔴 KRITICKÉ PROBLÉMY

### 1. References Section - NELZE POUŽÍT NA MOBILE

**Soubor:** `src/components/ReferencesSection.tsx`

#### Problémy:

**A) Fixed 50/50 Layout (řádky 158, 179)**
```tsx
<div className="w-1/2 flex flex-col justify-center px-8 lg:px-16">  // Left side
<div className="w-1/2 relative">  // Right side
```
- ❌ `w-1/2` = fixed 50% width na všech zařízeních
- ❌ Na mobile (375px) = 187px šířka - text se nevejde
- ❌ Side-by-side layout nefunguje na mobile

**B) ReferenceStatsCard - Přetéká (řádek 30)**
```tsx
<div className="...min-w-[320px] max-w-[420px]...">
```
- ❌ 320px min-width na 375px mobile = přetečení
- ❌ `right-8` positioning způsobuje scroll

**C) ReferenceList - Špatný padding**
```tsx
<div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
```
- ❌ Žádný responsive padding
- ❌ Text sizes nejsou mobile optimalizované

**D) Pinning Mechanism**
```tsx
{isPinned && <div style={{ height: `${featuredReferences.length * 100}vh` }} />}
```
- ❌ Pinning může způsobit problémy na mobile
- ❌ Scroll hijacking špatný UX na touch zařízeních

#### SEO Problémy:
- ❌ Chybí semantic HTML (`<article>`, `<figure>`)
- ❌ Chybí proper alt texts na background images
- ❌ Chybí structured data (schema.org)
- ⚠️ Fixed positioning může být problém pro crawlery

---

### 2. Team Section - Menší Problémy

**Soubor:** `src/components/TeamSection.tsx`

#### Dobré věci: ✅
- Grid responsive: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`
- Padding responsive: `px-6 md:px-12 xl:px-0`
- Image sizes správně: `sizes="(max-width: 640px) 100vw..."`
- Priority loading: `priority={index < 2}`

#### Problémy:

**A) SEO - Chybějící Strukturovaná Data**
```tsx
<motion.article>  // Dobře - semantic HTML
  <Image alt={member.name} />  // Dobře - alt text
  <h3>{member.name}</h3>  // Dobře
```
- ⚠️ Chybí schema.org Person markup
- ⚠️ Sociální linky by měly mít rel="me"

**B) Mobile UX - Focus Areas Overflow**
```tsx
<li className="...text-[0.65rem]...">
```
- ⚠️ Text může být příliš malý na mobile (10.4px)
- ⚠️ Touch targets (LinkedIn/Twitter buttons) jsou 44px - OK, ale mohly být větší

**C) Performance**
```tsx
<Image src="https://images.unsplash.com/..." />
```
- ⚠️ Externí images bez optimalizace
- ⚠️ Gradient overlays by mohly být optimalizované

---

### 3. FAQ Section - Dobré, Malé Vylepšení

**Soubor:** `src/components/FAQSection.tsx`

#### Dobré věci: ✅
- Grid responsive: `grid-cols-1 lg:grid-cols-2`
- Semantic HTML: `<section>`, `<button>`, `<h3>`
- Accessibility: ARIA attributes, keyboard navigation
- Scroll management

#### Menší Problémy:

**A) Mobile Typography**
```tsx
<h3 className="text-lg md:text-xl font-medium">
```
- ⚠️ 18px na mobile je OK, ale by mohl být 16px pro delší otázky

**B) SEO - Chybějící Schema**
- ⚠️ Chybí FAQPage schema.org markup
- ⚠️ Dynami content loading (z API) může být problém pro crawlery

**C) Touch Targets**
```tsx
<button className="w-full px-6 py-6...">
```
- ✅ Touch targets jsou 48px+ - výborné

---

## 🎯 IMPLEMENTAČNÍ PLÁN

### Priority 1: References Section - KRITICKÁ OPRAVA

#### Krok 1: Responsive Layout
**Před:**
```tsx
<div className="absolute inset-0 flex">
  <div className="w-1/2 flex flex-col justify-center">  // Left
  <div className="w-1/2 relative">  // Right
```

**Po:**
```tsx
<div className="absolute inset-0 flex flex-col lg:flex-row">
  <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-8 lg:py-0">
  <div className="w-full lg:w-1/2 relative">
```

**Změny:**
- `flex-col lg:flex-row` - stack na mobile, side-by-side na desktop
- `w-full lg:w-1/2` - full width na mobile, 50% na desktop
- `px-4 sm:px-8 lg:px-16` - responzivní padding
- `py-8 lg:py-0` - vertical spacing na mobile

#### Krok 2: ReferenceStatsCard Responsive
**Před:**
```tsx
<div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20">
  <div className="...min-w-[320px] max-w-[420px]...">
```

**Po:**
```tsx
<div className="absolute bottom-8 left-4 right-4 lg:top-1/2 lg:right-8 lg:left-auto lg:bottom-auto lg:transform lg:-translate-y-1/2 z-20">
  <div className="...min-w-0 w-full lg:min-w-[320px] lg:max-w-[420px]...">
```

**Změny:**
- Bottom positioning na mobile, right positioning na desktop
- `w-full lg:min-w-[320px]` - full width na mobile
- `left-4 right-4` - padding na mobile

#### Krok 3: ReferenceList Typography
**Před:**
```tsx
<ScrambleText
  className={`...${isActive ? 'text-4xl lg:text-5xl' : 'text-2xl lg:text-3xl'}...`}
```

**Po:**
```tsx
<ScrambleText
  className={`...${isActive ? 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl' : 'text-lg sm:text-xl lg:text-2xl xl:text-3xl'}...`}
```

**Změny:**
- Menší fonty na mobile
- Gradual scaling přes breakpointy

#### Krok 4: Disable Pinning na Mobile
```tsx
const shouldPin = !isMobile && rect.top <= 0 && rect.bottom > window.innerHeight;

// Add at top of component:
const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
```

#### Krok 5: SEO Enhancements
```tsx
<section
  className="..."
  itemScope
  itemType="https://schema.org/ItemList"
>
  {references.map((ref) => (
    <article
      itemScope
      itemType="https://schema.org/Organization"
      itemProp="itemListElement"
    >
      <meta itemProp="name" content={ref.name} />
      <img itemProp="image" src={ref.image.url} alt={ref.image.alt || ref.name} />
    </article>
  ))}
</section>
```

---

### Priority 2: Team Section - SEO Vylepšení

#### Krok 1: Schema.org Person Markup
```tsx
<motion.article
  itemScope
  itemType="https://schema.org/Person"
>
  <meta itemProp="name" content={member.name} />
  <meta itemProp="jobTitle" content={member.role} />
  <meta itemProp="description" content={member.bio} />
  <Image
    itemProp="image"
    alt={`${member.name} - ${member.role} at Expand Matrix`}
  />
  {member.linkedin && (
    <a
      itemProp="sameAs"
      rel="me noopener noreferrer"
      href={member.linkedin}
    >
  )}
</motion.article>
```

#### Krok 2: Mobile Typography Adjustment
```tsx
// Focus tags - zvětšit na mobile
<li className="...text-xs sm:text-[0.65rem]...">
```

#### Krok 3: Image Optimization Headers
```tsx
<Image
  loading={index < 2 ? "eager" : "lazy"}
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..."
/>
```

---

### Priority 3: FAQ Section - Schema Markup

#### Krok 1: FAQPage Schema
```tsx
<section
  itemScope
  itemType="https://schema.org/FAQPage"
>
  {faqs.map((faq) => (
    <div
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <h3 itemProp="name">{question}</h3>
      <div
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <div itemProp="text">{answer}</div>
      </div>
    </div>
  ))}
</section>
```

#### Krok 2: Server-Side Rendering Note
```tsx
// Ensure FAQs are SSR'd for SEO
// Current: Client-side API fetch
// Better: getServerSideProps or static generation
```

---

## 📊 OČEKÁVANÉ VÝSLEDKY

### References Section
✅ Mobile responsive (320px+)  
✅ Tablet optimized (768px+)  
✅ Desktop perfect (1024px+)  
✅ No horizontal scroll  
✅ Touch-friendly  
✅ Schema.org markup  

### Team Section
✅ Already responsive  
✅ SEO optimized with Person schema  
✅ Better image optimization  
✅ Improved mobile typography  

### FAQ Section
✅ Already responsive  
✅ SEO optimized with FAQPage schema  
✅ Crawler-friendly  

## 🚀 PERFORMANCE METRIKY

**Před:**
- References: 🔴 Mobile unusable
- Team: 🟡 95% mobile ready
- FAQ: 🟢 100% mobile ready

**Po:**
- References: 🟢 100% mobile ready
- Team: 🟢 100% optimized + SEO
- FAQ: 🟢 100% optimized + SEO

## 📱 TEST CHECKLIST

- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] Pixel 5 (393px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1920px)
- [ ] Touch interactions
- [ ] Keyboard navigation
- [ ] Screen readers
- [ ] Google Lighthouse (Mobile + Desktop)
- [ ] Schema validation (schema.org validator)

