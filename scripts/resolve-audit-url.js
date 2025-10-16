#!/usr/bin/env node
/*
 * Resolves the URL that Lighthouse should audit.
 * Preference order:
 *  1. LIGHTHOUSE_URL environment variable
 *  2. VERCEL_URL / DEPLOY_URL if provided (typical on hosting providers)
 *  3. Localhost default (http://127.0.0.1:3000)
 */

const DEFAULT_URL = 'http://127.0.0.1:3000';

function resolveAuditUrl() {
  const candidates = [
    process.env.LIGHTHOUSE_URL,
    process.env.DEPLOY_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ];
  return candidates.find((value) => typeof value === 'string' && value.length > 0) || DEFAULT_URL;
}

function main() {
  process.stdout.write(resolveAuditUrl());
}

if (require.main === module) {
  main();
}

module.exports = { resolveAuditUrl };
