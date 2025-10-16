# Mobile Responsivity Checklist - Expand Matrix

## Přehled
Tento dokument obsahuje kompletní checklist pro kontrolu responsivity webu Expand Matrix na mobilních zařízeních. Checklist je rozdělen podle sekcí webu a obsahuje specifické kontrolní body pro každou část.

## Testovací Breakpointy

### Mobilní zařízení
- **Mobile S**: 320px (iPhone SE, starší Android telefony)
- **Mobile M**: 375px (iPhone 12/13/14 standard)
- **Mobile L**: 425px (iPhone 12/13/14 Pro Max, větší Android telefony)

### Tablety
- **Tablet**: 768px (iPad standard)
- **Tablet L**: 1024px (iPad Pro)

### Desktop
- **Laptop**: 1440px
- **Desktop**: 1920px+

## Kontrolní Body podle Sekcí

### 1. Hero Section
**Lokace**: `src/components/Hero.tsx`

#### Navigace
- [ ] Logo je čitelné a správně velké (min. 24px)
- [ ] Hamburger menu funguje správně na mobilech
- [ ] Mobilní menu se otevírá/zavírá bez problémů
- [ ] Navigační odkazy jsou dostatečně velké pro dotyk (min. 44×44px)
- [ ] LocaleSwitcher funguje na mobilech

#### Hlavní nadpis (4 řádky)
- [ ] Text je čitelný na všech mobilech (320px+)
- [ ] Řádky se správně zalamují
- [ ] Velikost písma se přizpůsobuje (`clamp` hodnoty fungují)
- [ ] Žádný horizontální scroll
- [ ] Gradient text je viditelný

#### CTA tlačítko
- [ ] Tlačítko je dostatečně velké pro dotyk (min. 44×44px)
- [ ] Text je čitelný
- [ ] Hover efekty fungují na touch zařízeních
- [ ] Cal.com embed funguje na mobilech

#### 3D Logo a animace
- [ ] Logo se zobrazuje správně
- [ ] Animace nezpůsobují problémy s výkonem
- [ ] Respektuje `prefers-reduced-motion`
- [ ] Matrix rain efekt funguje na mobilech

### 2. Accuracy Section
**Lokace**: `src/components/AccuracySection.tsx`

#### Obsah
- [ ] Nadpisy jsou čitelné
- [ ] Texty mají správnou velikost (min. 16px)
- [ ] Statistiky jsou čitelné
- [ ] Neon glow efekty fungují správně
- [ ] Animace nezpůsobují problémy

### 3. Clients Section
**Lokace**: `src/components/ClientsSection.tsx`

#### Scrollování klientů
- [ ] Horizontal scroll funguje na touch zařízeních
- [ ] Logo klientů jsou čitelná
- [ ] Scroll je plynulý
- [ ] Žádné problémy s výkonem

### 4. Services Section ⚠️ KRITICKÉ
**Lokace**: `src/components/ServicesSection.tsx`

#### Service Cards
- [ ] **KRITICKÉ**: Service cards mají `min-width: 520px` - ověřit, že nezpůsobují horizontal scroll na malých mobilech (320px)
- [ ] Cards se správně zobrazují na různých velikostech
- [ ] Hover efekty fungují na touch zařízeních
- [ ] Text je čitelný uvnitř karet
- [ ] Plus ikony jsou dostatečně velké pro dotyk
- [ ] Animace při scrollování fungují správně

### 5. Process Section
**Lokace**: `src/components/ProcessSection.tsx`

#### Layout procesu
- [ ] Kroky jsou čitelné na mobilech
- [ ] Číslování je viditelné
- [ ] Texty mají správnou velikost
- [ ] Layout se přizpůsobuje různým velikostem obrazovky

### 6. References Section
**Lokace**: `src/components/ReferencesSection.tsx`

#### Reference Cards
- [ ] Cards se zobrazují správně na mobilech
- [ ] Obrázky mají správné velikosti
- [ ] Text je čitelný
- [ ] Lazy loading funguje správně
- [ ] Animace při načítání fungují

### 7. Team Section ⚠️ POZOR
**Lokace**: `src/components/TeamSection/index.tsx`

#### Sticky Header
- [ ] **POZOR**: Sticky positioning funguje správně na mobilech
- [ ] Header se správně zobrazuje při scrollování
- [ ] Text je čitelný

#### Team Cards Grid
- [ ] Cards se správně zobrazují na malých obrazovkách
- [ ] Grid layout funguje responsivně
- [ ] Obrázky mají správné velikosti
- [ ] Animace fungují správně
- [ ] Respektuje `prefers-reduced-motion`

### 8. FAQ Section
**Lokace**: `src/components/FAQSection.tsx`

#### Accordion Items
- [ ] Accordion se otevírá/zavírá správně na touch zařízeních
- [ ] Text je čitelný
- [ ] Animace fungují plynule
- [ ] Touch targets jsou dostatečně velké

### 9. Footer
**Lokace**: `src/components/Footer.tsx`

#### Grid Layout
- [ ] **POZOR**: 12-column grid se správně zhrnuje na mobilech (1 col → 12 cols)
- [ ] Všechny sekce jsou čitelné
- [ ] Odkazy fungují správně
- [ ] Newsletter form je použitelný na mobilech
- [ ] Social media ikony jsou dostatečně velké

### 10. Cookie Consent
**Lokace**: `src/components/CookieConsent.tsx`

#### Pozice a použitelnost
- [ ] Cookie banner se zobrazuje správně na mobilech
- [ ] Tlačítka jsou dostatečně velká pro dotyk
- [ ] Text je čitelný
- [ ] Banner nepřekrývá důležitý obsah

## Obecné Kontrolní Body

### Typografie
- [ ] Všechny texty mají minimálně 16px velikost
- [ ] Nadpisy používají `clamp()` pro responsivní velikosti
- [ ] Line-height je dostatečný (min. 1.4)
- [ ] Font weights jsou čitelné

### Touch Targets
- [ ] Všechna tlačítka jsou min. 44×44px
- [ ] Odkazy mají dostatečnou velikost
- [ ] Formulářové prvky jsou použitelné na touch zařízeních
- [ ] Mezery mezi touch targets jsou min. 8px

### Layout
- [ ] Žádný horizontální scroll na žádném zařízení
- [ ] Obsah se správně přizpůsobuje různým velikostem
- [ ] Margin a padding fungují správně
- [ ] Flexbox a Grid layout fungují responsivně

### Obrázky a Media
- [ ] Obrázky mají správné velikosti pro různé DPI
- [ ] Lazy loading funguje správně
- [ ] Alt texty jsou přítomné
- [ ] Obrázky se nedeformují

### Formuláře
- [ ] Input fields jsou dostatečně velké
- [ ] Placeholder text je čitelný
- [ ] Keyboard se správně zobrazuje na mobilech
- [ ] Formuláře jsou použitelné na touch zařízeních

### Animace a Interakce
- [ ] Respektuje `prefers-reduced-motion`
- [ ] Animace nezpůsobují problémy s výkonem
- [ ] Hover efekty fungují na touch zařízeních
- [ ] Scroll animace jsou plynulé

### Výkon
- [ ] Stránka se načítá rychle na mobilních sítích
- [ ] JavaScript neblokuje rendering
- [ ] Obrázky jsou optimalizované
- [ ] CSS je minifikovaný

### Přístupnost
- [ ] Kontrastní poměry jsou dostatečné (min. 4.5:1)
- [ ] Focus stavy jsou viditelné
- [ ] ARIA atributy jsou správně použité
- [ ] Keyboard navigace funguje

## Nástroje pro Testování

### Chrome DevTools
1. Otevřete Chrome DevTools (F12)
2. Klikněte na ikonu "Toggle device toolbar" (Ctrl+Shift+M)
3. Vyberte různé zařízení nebo nastavte custom rozměry
4. Testujte všechny breakpointy

### Doporučené Testovací Rozměry
- 320px (iPhone SE)
- 375px (iPhone 12/13)
- 425px (iPhone 12/13 Pro Max)
- 768px (iPad)
- 1024px (iPad Pro)

### Reálné Zařízení
- Testujte na skutečných mobilních zařízeních
- Použijte různé prohlížeče (Chrome, Safari, Firefox)
- Testujte různé orientace (portrait/landscape)

## Identifikované Potenciální Problémy

### 🔴 Kritické
1. **ServicesSection**: Service cards mají `min-width: 520px` - může způsobit horizontal scroll na malých mobilech (320px)

### 🟡 Pozor
1. **Hero heading**: Komplexní grid layout s multi-line heading - ověřit na malých obrazovkách
2. **TeamSection**: Sticky positioning - kontrola funkčnosti na mobilech
3. **Footer**: 12-column grid - ověřit správné zhrnutí na mobile

### 🟢 Doporučení
1. Přidat více breakpointů pro velmi malé obrazovky
2. Optimalizovat animace pro mobilní zařízení
3. Zvážit použití `touch-action` CSS vlastnosti pro lepší touch interakce

## Checklist Template

```
Datum testování: ___________
Tester: ___________
Zařízení/Prohlížeč: ___________

### Hero Section
- [ ] Navigace: OK / Problém: ___________
- [ ] Hlavní nadpis: OK / Problém: ___________
- [ ] CTA tlačítko: OK / Problém: ___________
- [ ] 3D Logo: OK / Problém: ___________

### Services Section
- [ ] Service cards: OK / Problém: ___________
- [ ] Horizontal scroll: OK / Problém: ___________

### Team Section
- [ ] Sticky header: OK / Problém: ___________
- [ ] Cards grid: OK / Problém: ___________

### Footer
- [ ] Grid layout: OK / Problém: ___________
- [ ] Newsletter form: OK / Problém: ___________

### Obecné
- [ ] Typografie: OK / Problém: ___________
- [ ] Touch targets: OK / Problém: ___________
- [ ] Layout: OK / Problém: ___________
- [ ] Výkon: OK / Problém: ___________

### Poznámky
_________________________________
_________________________________
```

## Závěr

Tento checklist pokrývá všechny klíčové aspekty responsivity webu Expand Matrix. Pravidelné testování podle tohoto checklistu zajistí, že web funguje správně na všech mobilních zařízeních a poskytuje optimální uživatelskou zkušenost.

**Doporučení**: Testujte na skutečných zařízeních alespoň jednou měsíčně a po každé větší změně v kódu.
