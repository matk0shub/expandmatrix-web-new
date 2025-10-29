# Server Offload Research (2025-10-29)

## Lighthouse Snapshot (desktop)
- Source: `docs/lighthouse/reports/desktop.json`
- Performance score `0.67`; FCP `0.3 s`, LCP `3.6 s`, TBT `250 ms`, CLS `0.01`.
- Total transfer `≈3.7 MiB` (`total-byte-weight.displayValue`), with `main-app.js` alone shipping `~1.7 MiB` compressed.
- Main-thread work is dominated by script evaluation (`~658 ms`) and parsing (`~197 ms`), see `audits.mainthread-work-breakdown`.
- Largest individual chunks come from client bundles: `_app-pages-browser_node_modules_gsap_index_js.js` (~614 KiB), `_app-pages-browser_node_modules_gsap_ScrollTrigger_js.js` (~348 KiB), `_app-pages-browser_src_components_HeroAnimated_tsx.js` (~25 KiB gzipped), `_app-pages-browser_node_modules_lenis_dist_lenis_mjs.js` (~21 KiB gzipped).

## Client-Heavy Entry Point
- `src/app/[locale]/page.tsx:1` instantiates `HomePageClient` and opts the entire landing page into client mode even for static sections.
- `src/components/HomePageClient.tsx:1` pulls in every hero/sections component; the `useCalEmbed` hook forces client rendering even where no interactivity is required.
- Result: the home route hydrates a single ~900 KiB (gzipped) page chunk (`app/%5Blocale%5D/page.js`) and loads all animation libraries on initial paint.

## Server Offload Opportunities
- **Split server vs. client shells**
  - Keep `HomePage` server-side and only stream small client islands. Wrap `useCalEmbed` inside a tiny client `CalEmbedInitializer` rendered near the CTA instead of keeping `HomePageClient` global.
  - Convert static sections (`Footer.tsx:1`, `FooterLinks.tsx:1`, `FooterBrand.tsx:1`, `CalCTAButton.tsx:1`) to server components; they only rely on deterministic props and can render translations via `getTranslations`.
- **Server fetches for content**
  - `TeamSection.tsx:1` triggers client fetches to `/api/team` via `useTeamMembers` (`src/hooks/useTeamMembers.ts:1`). Move the Payload query into the server route (e.g., an async RSC that calls `getPayloadClient`) and pass serialized data into a lean client card list for hover animations only.
  - `ReferencesSection.tsx:1` already accepts `references` props; extend this pattern so filtering and ordering happen server-side and hydrate only the carousel controls on the client.
- **Lazy-load heavy motion stacks**
  - `SmoothScroll.tsx:1` imports `lenis`, `gsap`, and `ScrollTrigger` on mount. Convert to a `dynamic()` import gated behind an interaction (e.g., only for desktop after scroll) or feature-detect and wrap in `requestIdleCallback` so the initial render stays server.
  - `ProcessSection.tsx:1`, `ClientsSection.tsx:1`, and `AccuracySection.tsx:1` all eagerly import `framer-motion`, `gsap`, or run randomization hooks. Extract static markup into server files and lazy-load the animated overlays per section (Next `dynamic` with `ssr: false` plus `IntersectionObserver` guard).
- **Translations without client hooks**
  - Replace `useTranslations` inside static sections (e.g., `ServicesSection.tsx:1`, `AccuracySection.tsx:1`) with `getTranslations` in server components, passing plain strings into presentational children. This prevents each section from being marked `'use client'`.
- **Third-party embeds**
  - `useCalEmbed.ts:1` loads `@calcom/embed-react` + remote script (`https://meet.expandmatrix.com/embed/embed.js` ~20 KiB gzipped). Instead of running globally, isolate the loader behind a user action (CTA click) or load after idle via a client island to avoid blocking hydration.

## Additional Notes
- TypeScript build currently fails because of explicit `any` usage in `ProcessSection.tsx:12` and incorrect `params` typing in `src/app/[locale]/privacy/page.tsx:10`; address these to unblock production builds and enable production bundle stats.
- Static media requests observed via dev logs (`/api/media/file/*.png` taking ~2.2 s) indicate that large hero/team placeholders should be optimized or moved to the `/public` folder so they can be served via the Next image optimizer/CDN.

## Recommended Next Steps
1. Create a server-first home shell: keep routing in `page.tsx`, move translations/data fetches there, and introduce client islands for `Hero`, `ClientsSection`, and the Cal.com embed.
2. Refactor `TeamSection` and `ServicesSection` into server + client pairs; cache Payload lookups with `unstable_cache` or route handlers for static generation.
3. Bundle-audit animations: split `gsap`/`ScrollTrigger`/`lenis` into route-level dynamic imports and measure the impact on Lighthouse after conversion.
4. Once serverization is in place, rerun `node scripts/run-lighthouse.js desktop` (and mobile) to confirm LCP drops below 2.5 s and total JS weight falls under 1 MiB gzip.
