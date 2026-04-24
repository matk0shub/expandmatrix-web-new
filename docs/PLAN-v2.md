# Prod Polish — Round 2

Branch: `prod-ready` (continuing).

## Goal

Lift mobile Lighthouse perf to ≥ 93, tighten security and SEO, add CI
safety nets. Stay in scope — no new features, no new design language.

## P0 — Mobile LCP (biggest perceived win)

- [ ] **U1** Font loading: add `display: 'swap'` to all custom next/font imports.
- [ ] **U2** Hero 3D logo: cut extrusion layers 12 → 6 (same visual thickness, half the DOM + animation cost).
- [ ] **U3** Preload the hero LCP image (`/logo.svg`) with `fetchPriority="high"` — already done, verify.
- [ ] **U4** Lazy load below-the-fold sections (`ReferencesSection`, `TeamSection`, `FAQSection`) via `next/dynamic` with a lightweight skeleton so they don't block TTI.

## P0 — Security / operations

- [ ] **U5** Add in-memory rate limit to `/api/newsletter` (10 req / minute / IP).
- [ ] **U6** Add `security.txt` at `/.well-known/security.txt` with security contact.
- [ ] **U7** Content Security Policy header in `netlify.toml` and `next.config.mjs` (report-only first, then enforce).
- [ ] **U8** Sentry scaffold: install `@sentry/nextjs`, wire empty config that no-ops when DSN missing. User adds DSN post-merge.

## P1 — SEO extensions

- [ ] **U9** hreflang `<link rel="alternate">` in `[locale]/layout.tsx` for en/cs/x-default.
- [ ] **U10** Add `Service` JSON-LD schema for the three core offerings (AI agents, websites, AI business implementation).
- [ ] **U11** Add `WebSite` JSON-LD with `SearchAction` (site-search-ready).
- [ ] **U12** Sitemap `lastModified` should reflect real content age, not `new Date()` on every build — pull from Payload `updatedAt` where available.

## P1 — Accessibility

- [ ] **U13** Skip-to-main link at top of `[locale]/layout.tsx` with `sr-only focus:not-sr-only` pattern.
- [ ] **U14** Enforce `color-scheme: dark` in `globals.css` so form fields / scrollbars use dark style.
- [ ] **U15** Audit `prefers-contrast: more` and strengthen subdued text colors in that branch.

## P1 — CI / DX

- [ ] **U16** GitHub Actions: `.github/workflows/ci.yml` runs lint + typecheck + build on every PR and push to main.
- [ ] **U17** Configure `@next/bundle-analyzer` budget warning in CI (bail if first-load > 200 kB).

## P2 — Code hygiene (nice-to-have)

- [ ] **U18** Consolidate `useFramerMotion` call sites into a single `<MotionWrapper>` helper — 12 copies today.
- [ ] **U19** Drop unused deps (`ts-prune` audit).
- [ ] **U20** README: correct Node version to the one we actually run (≥ 20.9 still valid but list 22/24 as tested).

## Out of scope (requires external services or new features)

- Plausible / Umami analytics (needs account + decision on tracking).
- Uptime monitor (external tool).
- Lighthouse CI SaaS (optional, can be added later).
- Renovate / Dependabot (GitHub-side config, user-level).
- Blog, video hero, testimonials carousel, pricing calculator — new features, need a separate branch + product decisions.
- Git history secret scrub — destructive, requires coordination with the team.

## Verification

After each sub-block (P0 / P1 / P2):
1. `pnpm lint && pnpm typecheck`.
2. `pnpm build`.
3. Re-run Lighthouse mobile + desktop (`pnpm audit:mobile`, `pnpm audit:desktop`).
4. Commit with scope prefix (`perf:`, `security:`, `seo:`, `a11y:`, `ci:`, `refactor:`, `docs:`).

Success criteria for this round:
- Mobile Lighthouse ≥ 93 perf / 100 a11y / 100 bp / 95 seo.
- Desktop remains ≥ 99 / 100 / 100 / 95.
- All P0 + P1 tasks landed.
