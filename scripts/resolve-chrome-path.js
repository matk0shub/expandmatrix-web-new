#!/usr/bin/env node
/*
 * Attempts to resolve a Chromium/Chrome executable path that Lighthouse can use.
 * Supports most CI environments by checking environment overrides first,
 * then falling back to common installation paths.
 */

const { existsSync } = require('node:fs');
const { execSync } = require('node:child_process');
const path = require('node:path');

function resolveFromEnv() {
  const explicit = process.env.LIGHTHOUSE_CHROME_PATH || process.env.CHROME_PATH;
  if (explicit && existsSync(explicit)) {
    return explicit;
  }
  return null;
}

function resolveOnLinux() {
  const candidates = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  try {
    const whichResult = execSync('which google-chrome || which chromium-browser || which chromium', {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).trim();
    if (whichResult) {
      return whichResult.split('\n')[0];
    }
  } catch (error) {
    // Ignore failures - we'll fall back to chrome-launcher later
  }

  try {
    const { Launcher } = require('chrome-launcher');
    const installations = Launcher.getInstallations();
    if (Array.isArray(installations) && installations.length > 0) {
      return installations[0];
    }
  } catch (error) {
    // chrome-launcher may not be available or may not resolve a binary - ignore
  }

  return null;
}

function resolveOnMac() {
  const appPaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    path.join(process.env.HOME || '', 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ];

  for (const candidate of appPaths) {
    if (candidate && existsSync(candidate)) {
      return candidate;
    }
  }

  try {
    const { Launcher } = require('chrome-launcher');
    const installations = Launcher.getInstallations();
    if (Array.isArray(installations) && installations.length > 0) {
      return installations[0];
    }
  } catch (error) {
    // Ignore
  }

  return null;
}

function resolveOnWindows() {
  const localAppData = process.env.LOCALAPPDATA || '';
  const programFiles = process.env.PROGRAMFILES || '';
  const programFilesX86 = process.env['PROGRAMFILES(X86)'] || '';

  const candidates = [
    path.join(localAppData, 'Google/Chrome/Application/chrome.exe'),
    path.join(programFiles, 'Google/Chrome/Application/chrome.exe'),
    path.join(programFilesX86, 'Google/Chrome/Application/chrome.exe'),
  ];

  for (const candidate of candidates) {
    if (candidate && existsSync(candidate)) {
      return candidate;
    }
  }

  try {
    const { Launcher } = require('chrome-launcher');
    const installations = Launcher.getInstallations();
    if (Array.isArray(installations) && installations.length > 0) {
      return installations[0];
    }
  } catch (error) {
    // Ignore
  }

  return null;
}

function resolveChromePath() {
  const envPath = resolveFromEnv();
  if (envPath) {
    return envPath;
  }

  switch (process.platform) {
    case 'darwin':
      return resolveOnMac();
    case 'win32':
      return resolveOnWindows();
    default:
      return resolveOnLinux();
  }
}

function main() {
  const chromePath = resolveChromePath();

  if (!chromePath) {
    console.error('Unable to locate a Chrome/Chromium executable for Lighthouse.');
    process.exitCode = 1;
  } else {
    process.stdout.write(chromePath);
  }
}

if (require.main === module) {
  main();
}

module.exports = { resolveChromePath };
