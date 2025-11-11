#!/usr/bin/env node

import { spawn } from 'node:child_process';
import net from 'node:net';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const PORT_HINTS = [
  process.env.PORT,
  process.env.NEXT_PORT,
  process.env.APP_PORT,
  process.env.DEV_PORT,
  process.env.npm_config_port,
];

const parsePort = (value) => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const resolvedPort = PORT_HINTS.map(parsePort).find((value) => value !== null) ?? null;
const host = process.env.HOST ?? process.env.NEXT_HOST ?? '0.0.0.0';
const defaultPort = resolvedPort ?? 3000;
const explicitPortRequested = PORT_HINTS.some((value) => parsePort(value) !== null);

const probePort = (port) =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();

    server.once('error', (error) => {
      server.close();
      reject(error);
    });

    server.listen(port, host, () => {
      server.close(() => resolve(port));
    });
  });

const findAvailablePort = async () => {
  if (explicitPortRequested && resolvedPort !== null) {
    await probePort(resolvedPort).catch((error) => {
      if (error && 'code' in error && error.code === 'EADDRINUSE') {
        throw new Error(
          `Port ${resolvedPort} is already in use. Set PORT (or NEXT_PORT) to a free value, or stop the existing process.`,
        );
      }
      throw error;
    });
    return resolvedPort;
  }

  let port = defaultPort;
  const maxAttempts = 50;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1, port += 1) {
    try {
      await probePort(port);
      if (port !== defaultPort) {
        console.warn(`[start] Port ${defaultPort} is busy, using ${port} instead.`);
      }
      return port;
    } catch (error) {
      if ('code' in error && error.code === 'EADDRINUSE') {
        continue;
      }
      throw error;
    }
  }

  throw new Error(`Unable to find an available port starting from ${defaultPort}.`);
};

const start = async () => {
  const port = await findAvailablePort();
  const nextBin = require.resolve('next/dist/bin/next');
  const env = {
    ...process.env,
    PORT: String(port),
    NEXT_PORT: String(port),
  };

  const child = spawn(process.execPath, [nextBin, 'start', '-p', String(port)], {
    stdio: 'inherit',
    env,
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
};

start().catch((error) => {
  console.error('[start] Failed to launch Next.js:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
