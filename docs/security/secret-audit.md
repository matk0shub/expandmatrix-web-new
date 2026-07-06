# Secret Audit

## Correction (2026-07-06)

The 2025-11-06 conclusion below is invalid. A 2026-07-06 audit found real credentials committed through tracked environment and deployment configuration files and in git history, including database, SMTP, Payload, and revalidation secrets. Treat the affected values as compromised and follow `docs/PRODUCTION_READINESS_PLAN.md` section S0.1 for rotation and history cleanup. Do not rely on the older summary until that work is complete.

Date: 2025-11-06

## Summary

- Tracked files were reviewed for committed credentials using `git ls-files` and ripgrep heuristics.
- No real secrets were found in the repository history.
- All environment-specific files are ignored via `.gitignore` (`.env*` with `!.env*.example`).
- Added `.env.example` so contributors can bootstrap local configuration without copying sensitive files.
- Normalised existing example env files to use placeholder values (`smtp.example.com`, `user@example.com`).

## Recommended workflow

1. Copy `.env.example` → `.env` for local development (and derive `.env.production` or other variants outside Git if needed).
2. Never commit the filled env files; Git already ignores them.
3. For production deployments copy `.env.example` into your secrets manager or `/opt/.../.env.production` and set the real credentials there.
4. Rotate credentials immediately if a real secret is ever committed and force-push history only after revocation.

## Commands executed

```
git ls-files | rg "\.env"
git check-ignore -v .env
rg -n "PAYLOAD_SECRET" -g"*"
```
