# Secret Audit

Date: 2025-11-06

## Summary

- Tracked files were reviewed for committed credentials using `git ls-files` and ripgrep heuristics.
- No real secrets were found in the repository history.
- All environment-specific files are ignored via `.gitignore` (`.env*` with `!.env*.example`).
- Added `.env.example` so contributors can bootstrap local configuration without copying sensitive files.
- Normalised existing example env files to use placeholder values (`smtp.example.com`, `user@example.com`).

## Recommended workflow

1. Copy `.env.example` → `.env` for local development or `.env.local` if you need overrides.
2. Never commit the filled env files; Git already ignores them.
3. For production deployments copy `env.production.example` and set the real credentials in a secure secrets manager.
4. Rotate credentials immediately if a real secret is ever committed and force-push history only after revocation.

## Commands executed

```
git ls-files | rg "\.env"
git check-ignore -v .env .env.local
rg -n "PAYLOAD_SECRET" -g"*"
```
