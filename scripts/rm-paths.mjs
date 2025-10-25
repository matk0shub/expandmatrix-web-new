#!/usr/bin/env node

import { rmSync } from 'fs';

const targets = process.argv.slice(2);

for (const target of targets) {
  if (!target) continue;

  try {
    rmSync(target, { recursive: true, force: true });
  } catch (error) {
    console.error(`Failed to remove ${target}:`, error);
    process.exitCode = 1;
  }
}
