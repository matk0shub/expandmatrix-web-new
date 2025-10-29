#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

async function main() {
  const [, , inputArg, outputArg] = process.argv;
  const inputPath = path.resolve(process.cwd(), inputArg ?? '.next/analyze/client.html');
  const outputPath = path.resolve(process.cwd(), outputArg ?? 'docs/lighthouse/reports/treemap.png');

  const exists = await fs
    .access(inputPath)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    throw new Error(`Analyzer file not found at ${inputPath}`);
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1600, height: 900 },
  });

  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(inputPath).href, {
      waitUntil: 'networkidle0',
    });

    await page.waitForSelector('#app canvas, #app svg', { timeout: 5000 });

    const panel = await page.$('#app');
    if (!panel) {
      throw new Error('Unable to locate treemap container (#app).');
    }

    await panel.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
    });
  } finally {
    await browser.close();
  }

  process.stdout.write(`Treemap screenshot saved to ${outputPath}\n`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
