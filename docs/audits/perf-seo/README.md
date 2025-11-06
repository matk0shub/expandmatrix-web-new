# Performance & SEO Audit Playbook

This folder tracks Lighthouse and related audit artefacts for **expandmatrix-web**.

## How the audits are produced

1. Run a production build (`pnpm build`).
2. Serve the build locally (`pnpm start`).
3. Execute Lighthouse profiles:
   ```bash
   pnpm audit:mobile
   pnpm audit:tablet
   pnpm audit:desktop
   ```
4. Reports are written to `docs/lighthouse/reports`. For every run, capture a short narrative in `docs/audits/perf-seo/<date>.md` summarising key metrics and regressions.

## Latest snapshot (2025-11-06)

| Profile | Perf | A11y | Best Practices | SEO |
| ------- | ---- | ---- | -------------- | --- |
| Mobile  | 0.74 | 0.94 | 0.77           | 1.00|
| Tablet  | 0.71 | 0.94 | 0.77           | 1.00|
| Desktop | 0.77 | 1.00 | 0.77           | 1.00|

Headline issues:
- Cal.com embed loads immediately, adding 72 third-party requests (~1.35 MB).
- Mobile nav toggle lacks accessible name.
- Several JS bundles contain unused code; best practices score is capped at 0.77.
- Redirect chain (`/ → /en`) wastes ~750 ms in throttled measurements.

Full notes live in [`2025-11-06.md`](./2025-11-06.md).

## Roadmap for improvements

1. **Cal.com embed hardening**
   - Lazy-load Cal widget only when a CTA is activated.
   - Explore Cal.com REST / headless APIs to avoid client-side auth cookies and heavy scripts.
   - Cache programmatic availability data instead of loading iFrame eagerly.

2. **Navigation accessibility polish**
   - Add `aria-label` to burger toggle and verify via Lighthouse + axe.

3. **Bundle diet & code splitting**
   - Inspect `_next/static/chunks/6544…js` with `ANALYZE=true pnpm build`.
   - Dynamic import heavy visual effects and optional components.
   - Plans considered (Nov 06):
     1. **Deferred Framer loader (chosen)** – use `requestIdleCallback`/interaction listeners before importing `framer-motion`; fallback renders without animation until bundle is ready.
     2. Split hero/process into CSS-only variants – larger rewrite; deferred for now.
     3. Route-level dynamic imports for animation-heavy sections – viable later if additional wins needed.

4. **Caching & headers**
   - Ensure static assets and third-party proxies serve `Cache-Control: public, max-age=31536000, immutable`.
   - Review edge/CDN config so HTML can be cached per-locale if feasible.

5. **Redirect strategy**
   - Serve locale content directly (e.g., detect preferred locale server-side) to eliminate `/ → /en` hops.

6. **Automation**
   - Wire Lighthouse CI / GitHub check to run weekly or on key branches.
   - Track trend lines to catch regressions early.

Keep this README updated whenever new audits are captured or when the remediation plan changes.
