# Sprint #2 Follow-up Plan

1. **Hero Simplification** – Replace the GSAP-driven 3D logo with a static AVIF/WebP hero illustration (or CSS-only transform) and hydrate the motion variant only after user interaction. Target: shave ≥1.2 s off LCP and cut TBT < 120 ms.
2. **Process Canvas Dial-back** – Skip the gravity canvas on mobile (static illustration fallback) and move physics into a web worker for desktop to eliminate per-frame work on the main thread.
3. **Client Bundle Diet** – Tree-shake lucide icon imports and audit third-party libs (gsap, framer-motion) for partial imports; aim to drop transferred JS under 200 kB.
4. **SEO Polish** – Add locale-specific `alternateName`, social meta images, and FAQ/Service JSON-LD blocks to push SEO ≥ 95.
5. **Vitals Monitoring** – Wire `reportWebVitals` into analytics to capture live LCP/INP/CLS and validate improvements post-deploy.
