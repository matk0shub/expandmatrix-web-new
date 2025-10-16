# Expand Matrix Marketing Site

This repository contains the Expand Matrix marketing site built with Next.js 15, Tailwind CSS, and next-intl. The project ships with smooth scrolling, interactive physics, and localized content.

## Local Development

```bash
npm install
npm run dev
```

The development server runs at [http://localhost:3000](http://localhost:3000).

## Production Build

Tailwind CSS's WASM build is disabled to avoid CI timeouts. Use the following commands for reproducible builds:

```bash
TAILWIND_DISABLE_OXIDE=1 npm ci --omit=optional
npm run build
```

## Lighthouse Audits

1. Build and start the production server:
   ```bash
   npm run build
   npm run start
   ```
2. In a separate terminal run the audits and summary generator:
   ```bash
   npm run audit:all
   node scripts/generate-lighthouse-summary.js
   ```

Audit reports are written to `docs/lighthouse/reports/` and the consolidated summary to `docs/lighthouse/summary.json`.

## Available Scripts

- `npm run dev` – start the development server.
- `npm run build` – build the production bundle.
- `npm run start` – run the production server.
- `npm run audit:mobile|tablet|desktop` – run Lighthouse for a single device profile.
- `npm run audit:all` – run all Lighthouse audits sequentially.
