# Git Branching Workflow

## Branch Structure

- `main` - Production/stable branch. All merged feature branches.
- `feat/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

## Workflow

1. Create feature branch from `main`
2. Make changes and commit
3. Merge to `main` with `--no-ff` flag to preserve history
4. Delete feature branch after merge
5. Tag releases after major merges

## Safety

- Always create safety tags before major operations
- Never force push to `main`
- Clean up old branches regularly

