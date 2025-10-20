# Update Card Accents - Services & Process Sections

## Požadavky

### 1. Services Section (Naše služby)
- ❌ Odstranit border (`border-2 border-green-500/40`)
- ✅ Přidat zelený pruh z **levé strany** (jako FAQ)

### 2. Process Section (Proces spolupráce)
- ❌ Odstranit 2 čárky ze **spodní strany** (vlevo + vpravo)
- ✅ Přidat zelený pruh ze **spodní strany** (jako FAQ má z levé strany)

## FAQ Sekce - Referenční Styl

**Soubor:** `FAQSection.tsx` řádek 179

```tsx
<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00d76b] to-[#00b85c] opacity-60" />
```

**Parametry:**
- Position: `absolute left-0 top-0 bottom-0`
- Width: `w-1` (4px)
- Gradient: `bg-gradient-to-b from-[#00d76b] to-[#00b85c]`
- Opacity: `opacity-60`

## Implementační Změny

### Services Section

**Soubor:** `src/components/ServicesSection.tsx`

#### 1. Odstranit Border
**Aktuální (řádek ~162):**
```tsx
bg-black/95 border-2 border-green-500/40 hover:border-green-400/70
```

**Nový:**
```tsx
bg-black/95
```

#### 2. Přidat Zelený Pruh (Levá strana)
Přidat do card containeru (před nebo za background glow):

```tsx
{/* Left edge accent - stejně jako FAQ */}
<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00d76b] to-[#00b85c] opacity-60 rounded-l-3xl" />
```

**Poznámka:** Přidáno `rounded-l-3xl` pro zaoblení rohu podle border-radius karty.

### Process Section

**Soubor:** `src/components/ProcessSection.tsx`

#### 1. Odstranit Dolní Čárky
**Aktuální (řádky ~411-412):**
```tsx
{/* Corner Accents - Lines */}
<div className="absolute bottom-8 left-8 w-16 h-0.5 bg-gradient-to-r from-green-400 to-transparent opacity-70" />
<div className="absolute bottom-8 right-8 w-16 h-0.5 bg-gradient-to-l from-green-400 to-transparent opacity-70" />
```

**Akce:** Odstranit tyto 2 řádky

#### 2. Přidat Zelený Pruh (Spodní strana)
Přidat místo odstraněných čárek:

```tsx
{/* Bottom edge accent - stejně jako FAQ má z levé strany */}
<div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#00d76b] to-[#00b85c] opacity-60 rounded-b-[4rem]" />
```

**Poznámky:**
- Position: `absolute left-0 right-0 bottom-0` (plná šířka)
- Height: `h-1` (4px) místo width
- Gradient: `bg-gradient-to-r` (zleva doprava) místo `to-b`
- Opacity: `opacity-60` (stejná jako FAQ)
- Border radius: `rounded-b-[4rem]` (odpovídá `rounded-[4rem]` kartě)

## Vizuální Výsledek

### Services Karty
```
┌──────────────────┐
│                  │  <- Zelený pruh z levé strany
│  001             │
│                  │
│  AI AGENTI       │
│                  │
│  [hover text]    │
│                  │
└──────────────────┘
```

### Process Karty
```
┌──────────────────┐
│  • topleft  •    │  <- Glowing dots zůstávají
│                  │
│  01 ──────       │
│                  │
│  Úvodní meeting  │
│                  │
│  [description]   │
│                  │
└──────────────────┘
  ^^^^^^^^^^^^^^^^     <- Zelený pruh ze spodní strany
```

## Krokový Plán

1. ✅ Services: Odstranit `border-2 border-green-500/40`
2. ✅ Services: Přidat zelený pruh z levé strany
3. ✅ Process: Odstranit 2 dolní čárky (left-8 a right-8)
4. ✅ Process: Přidat zelený pruh ze spodní strany
5. ✅ Test responzivity na všech zařízeních
6. ✅ Commit & push

