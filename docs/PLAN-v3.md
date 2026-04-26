# Round 4 — References mobile + perf chase

Branch: `main` direct (small, low-risk changes).

## Findings

### References section, mobile (375 × 812)

The section is `min-h-screen` so it fills exactly one viewport. Inside:
- Eyebrow "REFERENCE"
- Three reference titles stacked vertically (active=opacity 1, others=0.6)
- Buttons (Instagram + Website) only under the active card
- Background image fades behind everything
- Stats card (AI IMPACT OVERVIEW) anchored at the bottom

Issues:
- Three reference titles compete for attention with no obvious "tap to switch" hint.
- Active card's buttons sit between titles and stats — visual association is unclear.
- The bottom of the background image leaks under the stats card; with three different reference images alternating, it never feels intentional.
- 6.5 s auto-rotation can yank attention while the user is reading.
- No pagination dots / progress indicator.

### Lighthouse — local prod vs live

| | Local mobile | Live mobile | Local desktop | Live desktop |
|---|---|---|---|---|
| Perf | 84 | 80 | **99** | **74** |
| LCP | 4.4 s | 4.8 s | 0.9 s | 3.6 s |
| FCP | 1.2 s | 1.6 s | 0.3 s | 1.0 s |
| Speed Index | 1.9 s | 3.8 s | 0.8 s | 2.3 s |

Live results are noticeably worse than local — this is real CDN + network latency. The big drop on desktop (99 → 74) hints at extra network round-trips. Top live wins: redirect chain (~942 ms), unused JS (~150 ms).

### Social previews

OG + Twitter Card metadata is complete on `/en` and `/cs`:
- og:image 1200×630 PNG, alt set ✓
- twitter:card summary_large_image ✓
- og:url, og:site_name, locale + alternateLocale ✓

The bare `https://expandmatrix.com/` URL still 307→/en. Most scrapers (FB, Twitter, LinkedIn, Slack, iMessage) follow the redirect, but a small number snapshot only the first response, so adding `og:` tags to the root response is a nice safety net.

## Tasks

### P0 — References mobile UX (the actual user complaint)
- [ ] **R1** Mobile reference picker: switch from "stack of 3 cards" to a single-card carousel with arrow + dot pagination. Active = full opacity, no others crammed.
- [ ] **R2** Pin stats card directly under the active reference info on mobile (not on the side, not floating below all three) so the metric–reference link is obvious.
- [ ] **R3** Pause auto-rotation as soon as a touch is detected, not only after explicit click. Mobile users scrolling past shouldn't have content shifting.
- [ ] **R4** Background image: clip + dim more aggressively on mobile so it reads as an accent rather than a backdrop the eye has to parse.

### P0 — Verify and commit
- [ ] **R5** Visual verify mobile (375 + 412 widths), tablet (768), desktop (1280). No regressions on any breakpoint.
- [ ] **R6** Lint + typecheck + build.

### P1 — Social preview safety
- [ ] **R7** Serve a tiny HTML stub at `https://expandmatrix.com/` with the same OG / Twitter tags pointing at `og-image.png` so dumb scrapers get something useful even if they don't follow the 307.

### P1 — Live perf chase
- [ ] **R8** Replace the `/ → /en` server redirect with a Netlify edge rewrite (status 200) + canonical `<link>` so Lighthouse stops counting it as a redirect step.
- [ ] **R9** Bundle analyzer pass: identify the biggest cold-start chunk and split off any framer-motion / GSAP that isn't strictly needed on the home route.

### P2 — Defer
- [ ] Critical-CSS extraction beyond `experimental.inlineCss` (probably touches the hero rewrite).
- [ ] Service Worker / runtime caching (separate workstream).

## Verify after each block

1. `pnpm lint && pnpm typecheck && pnpm build`.
2. Visual on mobile + desktop.
3. Re-run `pnpm audit:mobile` against `http://localhost:3015/en` after R8.
4. Commit with prefix (`fix:`, `feat:`, `perf:`, `seo:`).

## Out of scope

- Hero LCP rewrite (would touch the brand animation).
- New routes / blog content.
- Auth / payments work.
