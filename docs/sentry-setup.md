# Sentry setup (optional, not installed)

Error tracking isn't wired up yet. When you're ready:

1. Create a Sentry project at https://sentry.io (Next.js template).
2. Install the SDK:
   ```bash
   pnpm add @sentry/nextjs
   ```
3. Run the bundled wizard (it will generate `sentry.client.config.ts`,
   `sentry.server.config.ts`, `sentry.edge.config.ts`, update
   `next.config.mjs` and add the build-time source map upload):
   ```bash
   pnpm dlx @sentry/wizard@latest -i nextjs
   ```
4. Set the following Netlify env vars (Site settings → Environment variables):
   - `SENTRY_DSN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN`
5. Confirm by throwing a test error locally:
   ```bash
   curl http://localhost:3015/api/sentry-example-api
   ```
   then checking the Sentry dashboard.

The wizard's output should no-op when `SENTRY_DSN` is unset, so adding
the SDK won't break local dev.
