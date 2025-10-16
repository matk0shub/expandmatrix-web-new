#!/usr/bin/env node
/*
 * Aggregates Lighthouse JSON reports into a single summary file that CI can publish.
 */

const fs = require('node:fs');
const path = require('node:path');

const REPORTS_DIR = path.resolve(process.cwd(), 'docs/lighthouse/reports');
const SUMMARY_PATH = path.resolve(process.cwd(), 'docs/lighthouse/summary.json');

const REPORT_MAP = {
  mobile: 'mobile.json',
  tablet: 'tablet.json',
  desktop: 'desktop.json',
};

const DEFAULT_URL = 'http://127.0.0.1:3000';
const resolvedUrl = (() => {
  const candidates = [
    process.env.LIGHTHOUSE_URL,
    process.env.DEPLOY_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ];
  return candidates.find((value) => typeof value === 'string' && value.length > 0) || DEFAULT_URL;
})();

const EMPTY_SCORE = {
  performance: null,
  seo: null,
  accessibility: null,
  bp: null,
};

function readReport(variant) {
  const reportPath = path.join(REPORTS_DIR, REPORT_MAP[variant]);
  const raw = fs.readFileSync(reportPath, 'utf8');

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return {
      status: 'error',
      error: `Invalid JSON: ${error instanceof Error ? error.message : error}`,
      score: { ...EMPTY_SCORE },
    };
  }

  if (parsed.status === 'error' || !parsed.categories) {
    const fallbackMessage =
      typeof parsed.error === 'string'
        ? parsed.error
        : parsed.runtimeError?.message || 'Lighthouse categories missing.';
    return {
      status: 'error',
      error: fallbackMessage,
      score: { ...EMPTY_SCORE },
    };
  }

  const { categories } = parsed;
  const normalize = (value) => (typeof value === 'number' ? Math.round(value * 100) / 100 : null);

  return {
    status: 'ok',
    score: {
      performance: normalize(categories.performance?.score ?? null),
      seo: normalize(categories.seo?.score ?? null),
      accessibility: normalize(categories.accessibility?.score ?? null),
      bp: normalize(categories['best-practices']?.score ?? categories.bestPractices?.score ?? null),
    },
  };
}

function ensureReportsExist() {
  for (const [variant, fileName] of Object.entries(REPORT_MAP)) {
    const fullPath = path.join(REPORTS_DIR, fileName);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing Lighthouse report: ${variant} (${fullPath})`);
    }
  }
}

function main() {
  ensureReportsExist();

  const summary = {
    url: resolvedUrl,
    generatedAt: new Date().toISOString(),
    results: {
      mobile: readReport('mobile'),
      tablet: readReport('tablet'),
      desktop: readReport('desktop'),
    },
  };

  fs.mkdirSync(path.dirname(SUMMARY_PATH), { recursive: true });
  fs.writeFileSync(SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  process.stdout.write(`Summary saved to ${SUMMARY_PATH}\n`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
