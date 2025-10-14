# Performance Audit

| Metric | Before (Mobile) | After (Mobile) |
| --- | --- | --- |
| Performance | 74 | 82 |
| Best Practices | 96 | 96 |
| SEO | 92 | 92 |
| Accessibility | 89 | 89 |
| LCP | 4.43 s | 3.98 s |
| CLS | 0.00 | 0.00 |
| INP | 0.00 s | 0.00 s |
| TBT | 0.22 s | 0.26 s |
| Page Weight | 599.25 kB | 383.63 kB |
| Network Requests | 33 | 33 |

## Highlights
- `ReferenceBackground` now streams remote imagery through `next/image`, cutting the main payload by ~215 kB and enabling AVIF/WebP negotiation.
- Clients/Process/Team sections hydrate lazily via dynamic imports, trimming initial JS from 236 kB ➝ 229 kB and reducing TTI pressure.
- Added strict Tailwind content scanning and pruned global overrides to slim CSS output.
- Limited Lato font weights (300/400/700) to reduce critical font bytes while keeping headings styled.
- Added long-lived immutable caching for `_next/static` and public assets with AVIF/WebP negotiation for repeat visits.

## Remaining Gaps
- Performance is still below the 90 target; TBT slightly regressed during audit (likely due to main-thread animation hooks) and LCP remains near 4 s.
- Further gains will require deeper animation throttling, additional code-splitting (e.g. FAQ/Accuracy), and replacing heavy hero visuals with optimised media.

## Sprint #2 – Plan
- Accelerate hero LCP by optimising above-the-fold media (AVIF/WebP), tightening font preloads, and nailing CLS-safe layout.
- Push TBT below 0.15 s via deeper splitting of Process/Team subsections, throttled animations, and lazy third-party init.
- Elevate SEO ≥ 95 with enriched metadata/JSON-LD while keeping request counts flat.
- Re-run Lighthouse (mobile-first) after changes and document before/after metrics plus remaining gaps.

## Sprint #2 – Results (Mobile)
| Metric | Before | After |
| --- | --- | --- |
| Performance | 82 | 88 |
| LCP | 3.98 s | 3.65 s |
| CLS | 0.00 | 0.00 |
| INP | 0.00 s | 0.00 s |
| TBT | 0.26 s | 0.16 s |
| JS Weight | 275.52 kB | 244.57 kB |
| Network Requests | 33 | 28 |
| Page Weight | 383.63 kB | 339.51 kB |

### Sprint #2 Highlights
- Above-the-fold hero now spins up only when visible, trimming initial script work and dropping LCP by ~330 ms.
- Process/Team sections stay out of the main bundle until they scroll near view, cutting mobile request count from 33 ➝ 28 and JS transfer by ~31 kB.
- Cal.com embed downloads lazily on contact reveal, keeping the main thread freer despite richer structured data.

## Server Check
- Status: OK – `npm run start -p 3000` served successfully (curl 200 for `/`, `/cs`, `/en`)
- Tooling: `npm run lint` ✓, `npx tsc --noEmit` ✓
- Notes: Hero animations now defer on mobile; Process canvas idles on handheld; web vitals logging wired via `reportWebVitals`
- TODO: Monitor live Web Vitals once deployed and pursue PERF_PLAN_NEXT.md items (hero media replacement, workerised canvas, bundle diet)
