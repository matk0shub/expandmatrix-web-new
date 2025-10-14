# Performance Improvement Plan

Mobile Performance remains at 82 (target ≥ 90) and SEO stays at 92 (target ≥ 95). The heaviest contributors are animation-rich hero/clients sections, render-blocking inline scripts, and large image payloads during first paint. Proposed next steps:

1. **Deeper Code-Splitting**
   - Split `Hero` into a server shell plus client-only motion layers (Framer Motion timelines).
   - Defer `FAQSection` and `AccuracySection` with `next/dynamic` to keep above-the-fold bundle minimal.

2. **Visual Asset Optimisation**
   - Replace hero SVG extrusion with a single lightweight WebGL canvas or static WebP/AVIF background to cut LCP below 2.5 s.
   - Generate `blurDataURL` placeholders for reference imagery and promote only the hero visual with `priority`.

3. **Animation Throttling**
   - Reduce GSAP timelines and mousemove handlers; rely on CSS transforms + `prefers-reduced-motion` gating to trim TBT < 200 ms.

4. **Third-Party Controls**
   - Evaluate postponing Cal.com initialisation until user intent (button click) and review other embeds/analytics before hydration.

5. **SEO Enhancements**
   - Audit structured data (JSON-LD for services/testimonials) and ensure critical metadata per locale to reach SEO ≥ 95.

6. **Monitoring**
   - Wire up `reportWebVitals` to stream LCP/CLS/INP to analytics for real-device tracking once deployed.
