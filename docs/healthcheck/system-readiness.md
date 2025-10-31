# System Readiness Checklist

This document captures the state of the Expand Matrix stack after removing legacy fallbacks. Use it as a pre-flight checklist before starting the app in development or production.

## 1. Environment Variables

Ensure the following variables are present before the app boots:

- `PAYLOAD_SECRET`
- `DATABASE_URI`
- `NEXT_PUBLIC_PAYLOAD_SERVER_URL`
- `PAYLOAD_PUBLIC_SERVER_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_NAME`

Sample production values live in `env.production.example`. Development defaults belong in `.env.local` (not committed).

## 2. Payload Configuration

- `payload.config.ts` exports a static `buildConfig` with direct imports of `@payloadcms/richtext-lexical`, `sharp`, and `nodemailer` (`payload.config.ts:1-133`).
- Environment lookups now require explicit values. Missing secrets or Mongo URIs throw immediately (`src/payload/env.ts:1-17`).
- Payload initialises once per runtime without offline fallbacks (`src/payload/getPayloadClient.ts:1-68`).

## 3. Next.js Configuration

- `next.config.ts` remains wrapped in `withPayload` and `next-intl`, with optional bundle analyser support.
- Webpack overrides only apply to dev-mode caching. `package.json` contains no `predev` or cache-clearing scripts.

## 4. Application Data Fetching

- Server loaders (`src/data/partners.server.ts`, `src/data/teamMembers.server.ts`, `src/data/references.server.ts`) rely solely on live Payload queries. Empty results log a warning but no longer render embedded sample data.
- API routes (`src/app/api/faqs`, `src/app/api/team`, `src/app/api/references`) surface Payload errors as HTTP `503` responses instead of returning static JSON.
- Client hooks (`src/hooks/useTeamMembers.ts`, `src/hooks/useFAQs.ts`) no longer substitute sample content on failure; they expose error state for the UI.

## 5. Build & Lint

- `npm run lint` — ✅ (executed during this health check.)
- `npm run build` — recommended before deployment (not run automatically here).

## 6. Deployment Follow-up

After deploying, execute Payload migrations with the production env file loaded:

```bash
./scripts/post-deploy.sh /opt/expandmatrix/shared/env/.env.production
```

## 7. Monitoring & Health

- `/api/payload/health` pings MongoDB using the live connection (`src/app/api/payload/health/route.ts:1-61`).
- Configure external monitors (Healthchecks.io, UptimeRobot, etc.) to watch the production URL and this endpoint.
- Log rotation instructions remain in `docs/deployment/single-server.md` section 9.

## Summary

The project is now free of build-time scripts (`predev`, cache cleaners) and runtime content fallbacks. With the required environment variables present and MongoDB reachable, both development and production instances fail fast instead of silently substituting sample data.
