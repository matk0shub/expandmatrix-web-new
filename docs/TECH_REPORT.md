# ExpandMatrix – Sanity Check Summary

- **Server status**: `npm run dev` serves http://localhost:3000, `curl -L` now returns 200 (compile ~1.5s, response ~2.3s) with no runtime stack traces in `/tmp/expandmatrix_dev.log`.
- **Lint & types**: `npm run lint` and `npx tsc --noEmit` both pass after restoring missing peer deps and ESLint support libs.
- **SSR & client split**: `src/app/[locale]/page.tsx` is back to a server component; heavy UI (`ClientsSection`, references rail, Cal embed) now mount through client wrappers that lazy-load with `next/dynamic({ ssr: false })`.
- **Animation & embeds**: `ClientsSection` physics loop is gated by IntersectionObserver and throttled via refs; Lenis waits for idle + visibility before starting; Cal.com script loads with `next/script` `afterInteractive` and initialises only when visible/idle.
- **Cleanup**: dropped unused animation constants, stale team mocks, redundant SVG assets, and unused packages (`@studio-freight/lenis`, `matter-js`, `@types/matter-js`); added Unsplash to `next.config.ts` remotePatterns.
- **Suggested follow-up**: run Lighthouse/perf panel in Chrome to benchmark bundle & interaction cost, consider further code-splitting (e.g. Process/Team sections), migrate hero animations toward declarative Motion if future perf budget tight, and monitor Web Vitals once deployed.
