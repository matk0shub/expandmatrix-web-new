# Lighthouse Audit Summary (2025-11-04)

| Device | Performance | Accessibility | Best Practices | SEO |
|--------|-------------|--------------|----------------|-----|
| Mobile | 0.74        | 0.94         | 0.77           | 1.00|
| Tablet | 0.65        | 0.94         | 0.77           | 1.00|
| Desktop| 0.92        | 0.95         | 0.92           | 1.00|

## Key Observations

- **Largest Contentful Paint** remains high on mobile (12.1s) and tablet (16.0s). Desktop sits at 7.2s. Optimization opportunities include image compression (hero SVG/PNG assets) and ensuring critical content loads sooner.
- **Total Blocking Time** is low (0ms across devices), indicating scripts are not blocking interactivity.
- **Main thread work** on mobile is high for `scriptEvaluation`, `styleLayout`, `other`. Consider reducing JS bundle size, deferring non-critical animations, and simplifying layout calculations (e.g., physics in Clients section).
- **SEO** scores 1.0 across all devices; no immediate issues detected. Continue to monitor structured data and locale coverage.
- **Best Practices** at 0.77 due to missing HTTPS/permissions checks in audit environment or potential warnings (verify remote resources, ensure correct image sizing).

## Suggested Next Steps

1. Compress hero/process imagery and consider responsive image variants to reduce LCP.
2. Investigate heavy JS execution (Services/Clients interactive elements) to cut mobile main-thread work.
3. Add `font-display: swap` or preload key fonts to improve perceived performance.
4. Review Lighthouse best-practice warnings (see report JSON) to address outstanding items.

Reports stored under `docs/lighthouse/reports/`.
