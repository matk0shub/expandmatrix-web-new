# Cache Header Verification — 2025-11-07

## Approach
- Start local production build (`pnpm build && pnpm start`).
- Use `curl -D - -o /dev/null` against representative routes/assets to inspect headers.
- Targets:
  - `/`, `/en`, `/cs`
  - `/_next/static/chunks/1b093e19-83b8a704f3eab71c.js`
  - `/_next/image?...logo.svg`
  - `/fonts/lato-v25-latin-regular.woff2`

## Findings
| Path | Cache-Control | Vary |
|------|---------------|------|
| / | s-maxage=31536000 (implicit Next default) | RSC/next router headers |
| /en | `public, max-age=60, s-maxage=600, stale-while-revalidate=600` | RSC + router headers |
| /cs | `public, max-age=60, s-maxage=600, stale-while-revalidate=600` | RSC + router headers |
| /_next/static/...chunk.js | `public, max-age=31536000, immutable` | `Sec-CH-Prefers-Color-Scheme, Accept-Encoding` |
| /_next/image?...logo.svg | `public, max-age=31536000, immutable` | `Sec-CH-Prefers-Color-Scheme` |
| /fonts/lato...woff2 | `public, max-age=31536000, immutable` | `Sec-CH-Prefers-Color-Scheme` |

## Notes
- Root `/` route still shows Next's default `s-maxage=31536000` due to App Router streaming; locale-specific `/en`/`/cs` respect our headers.
- `_next/image` and font/static bundles carry the intended immutable caching.
- For production verification, repeat against deployed domain to ensure CDN layer preserves headers.
