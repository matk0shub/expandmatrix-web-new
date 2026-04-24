# Production-Ready Plan

Branch: `prod-ready` (fork of `mobile-polish`)

## Acceptance criteria

- Hero 3D logo animation runs on mobile too (user request).
- Mobile Lighthouse ≥ 95 Perf / 100 A11y / 95 BP / 95 SEO.
- No hardcoded secrets in repo.
- No 404s for static assets on prod build.
- All P0 + P1 done. P2/P3 done as time permits.

## Tasks

### P0 — Fix regressions and promised behavior
- [ ] **T1** Re-enable hero 3D rotating logo on mobile (keep decorations off, only 3D logo). File: `src/components/HeroAnimated.tsx`.
- [ ] **T2** Verify partner images + all 14 balls render on mobile after resolveMediaUrl fix (already done — sanity check after T1).

### P0 — Security and deploy hygiene
- [ ] **T3** Scrub committed secrets. `.env` contains MongoDB URI with password + SMTP app-password. Remove from repo, add `.env` to `.gitignore`, write `.env.example` with keys only, document rotation.
- [ ] **T4** Remove client-side `[env check] PAYLOAD_SECRET present?` console.log visible in the browser.

### P0 — Performance (mobile LCP)
- [ ] **T5** Eliminate redirect chain `/ → /en` (Lighthouse: ~600 ms savings). Confirm via `curl -I /` that `/` serves a real HTML response (rewrite, not redirect).
- [ ] **T6** Trim unused JS (~300 ms). Run `@next/bundle-analyzer`, convert non-critical heavy imports to `dynamic()`.
- [ ] **T7** Reduce hero decorations on desktop too — 77 independently animated elements is overkill. Cut by ~60% and keep visual feel.

### P1 — Accessibility polish
- [ ] **T8** Fix aria-label ↔ visible text mismatches (navbar home link, reference cards). Align labels or use `sr-only` helper.
- [ ] **T9** `Document does not have a meta description` on one sub-route (Lighthouse mobile). Add metadata export where missing.

### P1 — SEO additions
- [ ] **T10** Add `/team`, `/partners`, `/faq` to sitemap with proper priority.
- [ ] **T11** Add `BreadcrumbList` structured data on sub-pages.

### P2 — Content hygiene
- [ ] **T12** Regenerate OG image with current branding (optional, user call).
- [ ] **T13** Verify team avatar URLs resolve correctly on prod (same fix as partners should cover them).

### P3 — Operational polish
- [ ] **T14** Confirm Payload `/admin` is not publicly accessible without auth in prod (or that the route is gated by env).
- [ ] **T15** Add a health-check to CI: fail build if Lighthouse mobile < 90 perf.

## Out of scope for this branch

- New features / new copy.
- Payload schema changes.
- Replacing design system / component library.

## Verification loop

After each task:
1. `pnpm lint && pnpm typecheck`.
2. `pnpm build`.
3. Visual spot check on mobile 375, desktop 1440 where relevant.
4. Re-run Lighthouse after T5/T6/T7.

Commit per task with scope prefix (`perf:`, `fix:`, `a11y:`, `seo:`, `security:`).
