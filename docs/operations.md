# Operations Setup

A living checklist for services the app expects but doesn't require at
build time. Everything below is opt-in via env vars so the bare repo
still builds and runs.

## 1. Error tracking — Sentry

Already scaffolded via `src/instrumentation.ts` + `src/instrumentation-client.ts`.
The SDK no-ops unless a DSN is present, so flipping it on is one env var:

1. Create a Next.js project at https://sentry.io.
2. Netlify → Site settings → Environment variables, add:
   - `SENTRY_DSN`
   - `NEXT_PUBLIC_SENTRY_DSN` (same value, exposed to the client bundle)
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN` (for source-map upload)
   - optional: `SENTRY_TRACES_SAMPLE_RATE=0.1`
3. Redeploy. Trigger a test error, confirm it shows in the Sentry
   dashboard. Adjust the sample rate once you know baseline volume.

## 2. Analytics — Plausible (or Umami)

Already scaffolded via `src/components/Analytics.tsx`. Renders nothing
without env vars, so no cookie banner disruption.

```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=expandmatrix.com
# optional for self-hosted Plausible / Umami:
NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js
```

Plausible is cookie-less and GDPR-compliant — no consent banner
changes needed.

## 3. Uptime monitoring

The app exposes `/api/payload/health` which returns `{status:'ok'}` +
Mongo latency. Point any monitoring tool at it:

### UptimeRobot (free, recommended)
1. https://uptimerobot.com → add monitor
2. Type: HTTP(s), URL: `https://expandmatrix.com/api/payload/health`
3. Interval: 5 minutes
4. Keyword alerting: `"status":"ok"` (alert if missing)
5. Add notification email / Slack webhook

### BetterStack (paid, better UX)
Same endpoint, supports public status pages.

## 4. Dependency updates — Dependabot

`.github/dependabot.yml` is not shipped (needs GitHub-side config).
Suggested config:

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 5
    groups:
      payload:
        patterns: ["@payloadcms/*", "payload"]
      next:
        patterns: ["next", "@next/*", "react", "react-dom"]
      testing:
        patterns: ["@types/*", "typescript", "eslint*"]
  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: monthly
```

Drop this at `.github/dependabot.yml` when you're ready to receive
weekly PRs. (It requires GitHub repo admin to enable.)

## 5. Lighthouse CI (optional)

The in-repo `pnpm audit:mobile / :tablet / :desktop` scripts already
drive Lighthouse locally. For CI-enforced budgets:

1. Install in CI: `pnpm add -D @lhci/cli`
2. Add `lighthouserc.json` with desired thresholds.
3. Extend `.github/workflows/ci.yml` with a job that boots `pnpm start`
   and runs `lhci autorun`.

This was intentionally not added to the default CI pipeline to keep
PR runtime short; flip it on when team bandwidth allows.

## 6. Git history secret scrub

Secrets (MongoDB password, SMTP app password, PAYLOAD_SECRET) were
previously committed in `.env` and `netlify.toml`. The current working
tree is clean, but history retains them.

### Recommended order
1. **Rotate all credentials first** (Atlas, Gmail, generate new PAYLOAD_SECRET).
2. Update Netlify env vars with new values, redeploy, confirm working.
3. Only then rewrite history with `scripts/scrub-git-history.sh`.
4. Force-push the rewritten history, notify the team to re-clone.

Step 3 is destructive — coordinate with anyone else working on the repo.
