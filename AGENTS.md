# ExpandMatrix Web

Marketing web expandmatrix.com — Next.js 15 (App Router) + Payload CMS (Mongo) + Tailwind 4, i18n cs/en přes next-intl, deploy Netlify. Blog má oddělený backend (Strapi na cms.expandmatrix.com).

## Commands

- Dev: `pnpm dev` (port přes `PORT`, výchozí 3000; dev config v .claude/launch.json používá 3001)
- Build: `pnpm build`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
- Pozor: build i dev vyžadují Node 24 (`.nvmrc`); na Node 26 padají (esbuild/cross-env ESM interop)

## Map

- Entry points: `src/app/[locale]/layout.tsx` (metadata, JSON-LD, providers), `src/app/[locale]/page.tsx` (homepage)
- `src/app/[locale]/` — lokalizované stránky (home, blog, terms, privacy)
- `src/app/(payload)/` — Payload CMS admin (/admin)
- `src/app/api/` — API routes (newsletter, revalidate, media proxy, public/*)
- `src/components/` — React komponenty (většina "use client")
- `src/data/` — datová vrstva: `*.server.ts` = cachovaný fetch z Payloadu, `*.ts` = normalizace + fallback data
- `src/payload/` — Payload config a kolekce (partners, team, references, faqs, media, users)
- `src/messages/` — překlady cs.json / en.json (next-intl)
- `docs/PRODUCTION_READINESS_PLAN.md` — aktuální plán oprav a vylepšení

## Working agreements

- Simplicity first: minimum code that solves the problem; nothing speculative; no
  abstractions for single-use code.
- Surgical changes: every changed line traces to the task; match existing style; don't
  "improve" adjacent code; never delete code you don't understand - flag it instead.
- Run the typecheck/lint commands above before claiming a task is done, and report
  their actual output.

## Hard constraints

- Use pnpm, never npm/yarn.
- Do NOT commit secrets: `.env` je dočasně trackovaný (viz PRODUCTION_READINESS_PLAN.md S0.1) — nikdy do něj nepřidávej nové hodnoty ani ho nekopíruj jinam.
- Do NOT touch: `payload-types.ts` (generovaný), `.next/`, `docs/security/` bez explicitního zadání.
- i18n: uživatelské texty patří do `src/messages/*.json`, ne natvrdo do komponent (výjimka: JSON-LD a legal obsah v `src/data/legalContent.ts`).
- Web je černý dark-only design s brand zelenou `#00d76b` — nové UI musí ladit.
