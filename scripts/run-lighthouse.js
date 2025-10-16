#!/usr/bin/env node
/*
 * Runs Lighthouse using a variant-specific configuration and stores the JSON report.
 * When Chrome cannot be launched (e.g. in sandboxed CI environments), a fallback report
 * with `{ status: 'error' }` is written so that downstream tooling can still aggregate
 * the results without failing the pipeline.
 */

const fs = require('node:fs');
const path = require('node:path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { resolveChromePath } = require('./resolve-chrome-path');
const { resolveAuditUrl } = require('./resolve-audit-url');

const VARIANTS = new Set(['mobile', 'tablet', 'desktop']);

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function createErrorReport(variant, reason) {
  const errorMessage = typeof reason === 'string' ? reason : reason?.message || 'Unknown Lighthouse error';
  return {
    status: 'error',
    variant,
    error: errorMessage,
    generatedAt: new Date().toISOString(),
  };
}

async function run(variant) {
  const configPath = path.resolve(process.cwd(), `${variant}.config.js`);
  const outputPath = path.resolve(process.cwd(), 'docs/lighthouse/reports', `${variant}.json`);

  let config;
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    config = require(configPath);
  } catch (error) {
    const details = error instanceof Error ? error.message : `${error}`;
    writeJson(outputPath, createErrorReport(variant, `Unable to load config: ${details}`));
    console.error(`[lighthouse:${variant}] Unable to load config from ${configPath}: ${details}`);
    return false;
  }

  const url = (config.urls && config.urls[0]) || resolveAuditUrl();
  const chromePath = resolveChromePath();
  if (!chromePath) {
    writeJson(outputPath, createErrorReport(variant, 'Unable to resolve a Chrome executable path.'));
    console.error(`[lighthouse:${variant}] Chrome executable not found. Report stub saved.`);
    return false;
  }

  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromePath,
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
    });
  } catch (error) {
    writeJson(outputPath, createErrorReport(variant, error));
    console.error(`[lighthouse:${variant}] Failed to launch Chrome: ${error instanceof Error ? error.message : error}`);
    return false;
  }

  try {
    const options = {
      logLevel: 'error',
      output: 'json',
      port: chrome.port,
    };

    const result = await lighthouse(url, options, config);
    const report = Array.isArray(result.report) ? result.report[0] : result.report;
    const parsed = typeof report === 'string' ? JSON.parse(report) : report;
    const payload = {
      ...parsed,
      status: 'ok',
      variant,
      auditedUrl: url,
      generatedAt: new Date().toISOString(),
    };
    writeJson(outputPath, payload);
    process.stdout.write(`Saved ${variant} report to ${outputPath}\n`);
    return true;
  } catch (error) {
    writeJson(outputPath, createErrorReport(variant, error));
    console.error(`[lighthouse:${variant}] Audit failed: ${error instanceof Error ? error.message : error}`);
    return false;
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

async function main() {
  const [, , variant] = process.argv;
  if (!variant || !VARIANTS.has(variant)) {
    console.error('Usage: node scripts/run-lighthouse.js <mobile|tablet|desktop>');
    process.exitCode = 1;
    return;
  }

  await run(variant);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
