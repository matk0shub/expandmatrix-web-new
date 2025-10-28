#!/usr/bin/env node
/*
 * Runs Lighthouse using a variant-specific configuration and stores the JSON report.
 * When Chrome cannot be launched (e.g. in sandboxed CI environments), a fallback report
 * with `{ status: 'error' }` is written so that downstream tooling can still aggregate
 * the results without failing the pipeline.
 */

const fs = require('node:fs');
const path = require('node:path');
const lighthouseModule = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { resolveChromePath } = require('./resolve-chrome-path');
const { resolveAuditUrl } = require('./resolve-audit-url');

const VARIANTS = new Set(['mobile', 'tablet', 'desktop']);
const runLighthouse =
  typeof lighthouseModule === 'function'
    ? lighthouseModule
    : typeof lighthouseModule?.default === 'function'
      ? lighthouseModule.default
      : lighthouseModule?.lighthouse;

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

const TRACE_SUFFIX = '-trace.json';
const HTML_EXTENSION = '.html';

async function run(variant) {
  const configPath = path.resolve(process.cwd(), `${variant}.config.js`);
  const outputPath = path.resolve(process.cwd(), 'docs/lighthouse/reports', `${variant}.json`);
  const htmlOutputPath = path.resolve(process.cwd(), 'docs/lighthouse/reports', `${variant}.html`);
  const traceOutputPath = path.resolve(
    process.cwd(),
    'docs/lighthouse/reports',
    `${variant}${TRACE_SUFFIX}`,
  );

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

  if (typeof runLighthouse !== 'function') {
    const reason = 'Installed lighthouse package does not expose a runnable entry point.';
    writeJson(outputPath, createErrorReport(variant, reason));
    console.error(`[lighthouse:${variant}] ${reason}`);
    return false;
  }

  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromePath,
      chromeFlags: [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--allow-insecure-localhost',
        '--ignore-certificate-errors',
      ],
    });
  } catch (error) {
    writeJson(outputPath, createErrorReport(variant, error));
    console.error(`[lighthouse:${variant}] Failed to launch Chrome: ${error instanceof Error ? error.message : error}`);
    return false;
  }

  try {
    const options = {
      logLevel: 'error',
      output: ['json', 'html'],
      port: chrome.port,
    };

    const result = await runLighthouse(url, options, config);
    const reports = Array.isArray(result.report) ? result.report : [result.report];
    const jsonReport = reports.find(
      (entry) => typeof entry === 'string' && entry.trim().startsWith('{'),
    );
    const htmlReport = reports.find(
      (entry) => typeof entry === 'string' && entry.trim().startsWith('<'),
    );

    if (!jsonReport) {
      throw new Error('Lighthouse run did not return a JSON report.');
    }

    const parsed = JSON.parse(jsonReport);
    const payload = {
      ...parsed,
      status: 'ok',
      variant,
      auditedUrl: url,
      generatedAt: new Date().toISOString(),
    };
    writeJson(outputPath, payload);

    if (htmlReport) {
      fs.mkdirSync(path.dirname(htmlOutputPath), { recursive: true });
      fs.writeFileSync(htmlOutputPath, htmlReport, 'utf8');
    }

    const tracesArtifact = result.artifacts?.traces ?? result.artifacts?.Traces;
    if (tracesArtifact) {
      const passes = Object.keys(tracesArtifact);
      const selectedKey = passes.find((key) => key.toLowerCase().includes('default')) ?? passes[0];
      const trace = tracesArtifact[selectedKey];

      if (trace) {
        writeJson(traceOutputPath, trace);
      }
    }

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
