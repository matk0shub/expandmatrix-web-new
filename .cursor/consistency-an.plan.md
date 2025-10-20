# Our Partners Responsive Physics

## Goal

Udělat sekci "Our Partners" plně konzistentní napříč zařízeními: zachovat interaktivní fyzikální koule na mobilu i desktopu, jen adaptovat velikosti a rozložení.

## Strategy

1. **Odstranit mobilní fallback**
   - Vyhodit media query, která nastavuje `isMobileDisabled`.
   - Zrušit branch, která vrací statický grid.
   - Zachovat fallback pouze pro `prefersReducedMotion`.

2. **Responzivní velikosti koulí a středu**
   - Vytvořit helper `calculateDimensions(width: number)` vracející `ballSize`, `greenRadius`, `spacing`, apod.
   - Použít `clamp` logiku (např. `const ballSize = Math.round(clamp(width * 0.18, 72, 160))`).
   - Uložit hodnoty do `useRef` a aplikovat při registraci/resize.

3. **Aktualizace inicializace a resize**
   - V `initializeBalls` použít nové dimenze (radiusy, random spawn zóny dle aktuální výšky).
   - Aktualizovat `greenPhysicsRef` podle `greenRadius`.
   - Ujistit se, že `renderBalls()` respektuje nové velikosti.

4. **Layout a text**
   - Upravit centrální textové prvky na `clamp()` velikost (např. `text-[clamp(1.75rem,4vw,3.5rem)]`).
   - Nastavit `section` min-height pomocí CSS `clamp` (`min-h-[clamp(480px,110vw,720px)]`).
   - Vložit `padding` a `max-width` tak, aby text nebyl mimo obraz.

5. **Testing**
   - Ověřit mobilní interakce (tap + drag) na simulaci (Chrome dev tools, iPhone SE).
   - Ověřit standard desktop.
   - Zkontrolovat `prefersReducedMotion`, aby fallback stále fungoval.
