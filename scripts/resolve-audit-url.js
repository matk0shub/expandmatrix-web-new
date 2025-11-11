#!/usr/bin/env node
/*
 * Resolves the URL that Lighthouse should audit.
 * Preference order:
 *  1. Specific overrides (LIGHTHOUSE_URL / LIGHTHOUSE_BASE_URL)
 *  2. Hosting provider hints (DEPLOY_*, NETLIFY_DEV_URL, VERCEL_URL, etc.)
 *  3. Localhost default using the configured PORT (falls back to 3000)
 */

const PORT_HINTS = [
  process.env.PORT,
  process.env.APP_PORT,
  process.env.NEXT_PORT,
  process.env.DEV_PORT,
  process.env.npm_config_port,
];

const resolveDefaultPort = () => {
  for (const candidate of PORT_HINTS) {
    if (!candidate) continue;
    const parsed = Number.parseInt(candidate, 10);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 3000;
};

const createDefaultUrl = () => `http://127.0.0.1:${resolveDefaultPort()}`;

const tryParseUrl = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const sanitized = trimmed.replace(/^\/+/, '');
  const attempts = [trimmed];
  if (!/^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)) {
    attempts.push(`http://${sanitized}`);
    attempts.push(`https://${sanitized}`);
  }

  for (const attempt of attempts) {
    try {
      return new URL(attempt);
    } catch {
      // continue
    }
  }

  return null;
};

function resolveAuditUrl() {
  const exactCandidates = [process.env.LIGHTHOUSE_URL];
  for (const candidate of exactCandidates) {
    const url = tryParseUrl(candidate);
    if (url) {
      return url.toString();
    }
  }

  const baseCandidates = [
    process.env.LIGHTHOUSE_BASE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.URL,
    process.env.DEPLOY_URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_PREVIEW_URL,
    process.env.NETLIFY_DEV_URL,
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
    process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ];

  for (const candidate of baseCandidates) {
    const url = tryParseUrl(candidate);
    if (url) {
      return url.origin;
    }
  }

  return createDefaultUrl();
}

function main() {
  process.stdout.write(resolveAuditUrl());
}

if (require.main === module) {
  main();
}

module.exports = { resolveAuditUrl };
