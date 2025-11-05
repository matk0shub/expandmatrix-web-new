#!/usr/bin/env node

import { rmSync, renameSync } from 'fs';
import { basename } from 'path';

const targets = process.argv.slice(2);

for (const target of targets) {
  if (!target) continue;

  try {
    rmSync(target, { recursive: true, force: true });
  } catch (error) {
    // Some environments (macOS, file locks) may throw ENOTEMPTY/EBUSY sporadically.
    // Fallback: rename the folder so build can proceed and Next can recreate a fresh one.
    try {
      const fallback = `${target}.stale-${Date.now()}`;
      renameSync(target, fallback);
      console.warn(`rm-paths: could not remove ${basename(target)}. Renamed to ${basename(fallback)} to unblock build.`);
      // Do not fail the build; leave exitCode unset (0)
    } catch (renameErr) {
      console.error(`Failed to remove or rename ${target}:`, renameErr);
      process.exitCode = 1;
    }
  }
}
