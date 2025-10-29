# Server Offload Progress (2025-10-29)

## Latest Lighthouse Summary
- **Desktop** (`docs/lighthouse/reports/desktop.json`): Performance 0.63, LCP 3.5 s, TBT 0.25 s, INP not reported (no interactions captured).
- **Mobile (simulated)** (`docs/lighthouse/reports/mobile.json`): Performance 0.49, LCP 20.1 s, TBT 1.43 s, INP not reported (no interactions captured).
- First-load JS remains **196 kB** for the localized landing route according to `next build` output.
- Treemap capture: `docs/lighthouse/reports/treemap.png` (generated from `ANALYZE=true` build).

_Prior desktop snapshot (earlier on 2025-10-29) reported LCP 3.6 s and the same TBT 0.25 s; the recent refactor shaved ~0.1 s off LCP while keeping the blocking budget flat._

## Current Architecture Notes
- `src/app/[locale]/page.tsx` now renders the landing shell on the server and streams only the required client islands (`Hero`, physics clients, FAQ accordion, etc.). The old `HomePageClient` facade has been removed.
- `src/components/ReferencesSection.tsx` and `src/data/references.server.ts` fetch featured references through the Payload local API (with sample fallback) before hydrating `ReferencesSectionClient`. All reference copy strings are resolved server-side via `next-intl`.
- `TeamSection` and `ServicesSection` follow the same RSC + client island split; the client components only handle animations, hover states, and scramble effects.
- `CalEmbedInitializer` isolates the Cal.com embed scripts so they load outside of the main render path.

## Deferred Animation Stack
- `ProcessSection.tsx` waits for viewport intersection before dynamically importing GSAP + ScrollTrigger, and `SmoothScroll.tsx` waits for user interaction (wheel/touch/keyboard) before importing Lenis/GSAP. 
- Bundle analyzer output (`.next/analyze/client.html`) confirms the GSAP (`static/chunks/c15bf2b0…js`) and Lenis (`static/chunks/2691…js`) bundles are **not** marked as initial for `app/[locale]/page`.

## Follow-up Opportunities
1. Investigate the mobile LCP/TBT regressions—current simulated mobile preset shows long tasks (>1.4 s TBT, 20 s LCP). Consider image weights and third-party embeds for that viewport.
2. Explore server-side hydration of remaining static sections (`ClientsSection`, `AccuracySection`) once their animation requirements can be isolated similarly to Process/SmoothScroll.
3. Continue slimming the admin payload bundles surfaced in the treemap (large `@payloadcms/ui` chunks) when working on CMS-specific routes.
