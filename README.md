<p align="center">
  <img src="./public/logo.svg" alt="Expand Matrix logo" width="120" height="120" />
</p>
<h1 align="center">Expand Matrix Web Experience</h1>
<p align="center">Responsive marketing site, interactive physics, multilingual content and Cal-powered booking flows.</p>

---

## Overview

This repository contains the public-facing Expand Matrix website built with Next.js 15, App Router and Tailwind CSS 4. It ships with:

- immersive hero and "Our Partners" sections powered by Framer Motion + custom physics
- fully localized copy via <code>next-intl</code> (English &amp; Czech)
- reusable Cal booking CTAs with a dark-branded embed
- structured data (Organization, FAQ, ItemList, Person) for SEO-rich snippets
- Payload CMS collections for team, references, FAQs and more

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19, Server Actions)
- **Styling:** Tailwind CSS 4, CSS variables, custom motion gradients
- **Animation:** Framer Motion, Lenis smooth scrolling, custom physics engine
- **Internationalization:** next-intl with locale-specific metadata generation
- **CMS:** Payload 3 with MongoDB adapter and Lexical editor
- **Tooling:** TypeScript, ESLint (flat config), Lighthouse scripts, Cal.com embed

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the dev server**
   ```bash
   npm run dev
   ```
3. Visit [http://localhost:3000](http://localhost:3000) — the site auto-detects locales at `/en` and `/cs`.

> ℹ️ Tailwind’s Oxide engine is disabled in CI for determinism. When installing in CI, use `TAILWIND_DISABLE_OXIDE=1 npm ci --omit=optional`.

## Quality Gates

| Check | Command | Notes |
| --- | --- | --- |
| Lint | `npm run lint` | Uses the flat config and ignores generated/artifact folders. |
| Type-safety | `npm run build` | Next.js build will surface type errors and bundle issues. |
| Performance Audit | `npm run audit:all` | Runs Lighthouse (Chrome required). Reports saved to `docs/lighthouse/reports/`. |

All three commands should pass before merging or deploying. When Chrome is unavailable (CI, containers), run the Lighthouse scripts locally and commit updated reports.

## SEO & Accessibility

- Page metadata is generated per-locale in `src/app/[locale]/layout.tsx` (Open Graph, Twitter, canonical links).
- Schema.org JSON-LD for the organization lives in the root layout; section components expose FAQ, Person, and ItemList schemas.
- Every Next `<Image />` call requires a descriptive `alt`. When uploading assets through Payload, set the `alt` field on the `Media` collection so optimised images retain accessible descriptions.
- Keep headings hierarchical — partner orb headings clamp to the same typographic scale across breakpoints.

## Payload CMS Quickstart

Payload powers team members, references, FAQs, footer links, subscribers and global settings.

1. **Environment variables** (create `.env.local` / `.env`):
   ```bash
   PAYLOAD_SECRET=replace-with-long-random-string
   DATABASE_URI=mongodb://127.0.0.1:27017/expandmatrix
   ```
2. **Run Payload alongside Next.js**
   ```bash
   npx payload dev --config payload.config.ts
   ```
   This spins up the admin UI at [http://localhost:3000/admin](http://localhost:3000/admin). The command watches the same files as Next.js, so keep it in a separate terminal.
3. **Create the first admin user** via the UI prompt or CLI:
   ```bash
   npx payload create-user --config payload.config.ts --email you@example.com
   ```
4. **Uploads** land in `/media` by default. Optimised sizes (`thumbnail`, `card`, `tablet`) are generated automatically.
5. **Consuming content**: the Next.js app currently reads from localized JSON. When you’re ready to fetch live payload content, use the generated `payload-types.ts` for end-to-end typing.

## Deployment Checklist

1. `npm run lint`
2. `npm run build`
3. `npm run audit:all` (against a production URL or a local `npm run start` server)
4. Ensure environment variables are supplied (`PAYLOAD_SECRET`, `DATABASE_URI`, analytics keys, etc.).
5. Upload optimised imagery to `public/images` (Next.js will convert to WebP on the fly) and keep CMS media metadata current.

## Project Structure

```
├── src/
│   ├── app/                 # App Router entry, metadata, layout
│   ├── components/          # UI building blocks (hero, partners, team, etc.)
│   ├── hooks/               # Reusable hooks (Cal embed, scroll, etc.)
│   ├── messages/            # Localised copy (en/cs)
│   └── payload/             # Payload collections & globals
├── public/                  # Static assets (logos, images, fonts, robots)
├── docs/lighthouse/         # Stored Lighthouse JSON reports + summary
├── scripts/                 # Build helpers and Lighthouse automation
└── payload.config.ts        # Payload CMS configuration
```

## Support & Contributions

Pull requests are welcome. Please:

1. Keep commits focused and descriptive.
2. Include screenshots for visual tweaks (desktop & mobile when applicable).
3. Run the quality gate commands listed above.
4. Update translations (`src/messages/en.json`, `src/messages/cs.json`) when user-facing copy changes.

---

Crafted with care by the Expand Matrix engineering team.
