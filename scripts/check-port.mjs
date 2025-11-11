#!/usr/bin/env node

import net from 'node:net';

const resolvePort = () => {
  const candidates = [
    process.env.PORT,
    process.env.NEXT_PORT,
    process.env.APP_PORT,
    process.env.npm_config_port,
    process.argv[2],
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const parsed = Number.parseInt(candidate, 10);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return 3000;
};

const port = resolvePort();
const host = process.env.DEV_HOST ?? process.env.HOST ?? '0.0.0.0';

const server = net.createServer();

const bail = (message) => {
  console.error(`[check-port] ${message}`);
  process.exit(1);
};

server.once('error', (error) => {
  if ('code' in error && error.code === 'EADDRINUSE') {
    bail(`Port ${port} is already in use. Stop the existing process (e.g. "lsof -i :${port}") before running this command.`);
  }
  bail(`Failed to verify port ${port}: ${error instanceof Error ? error.message : String(error)}`);
});

server.once('listening', () => {
  server.close(() => {
    process.exit(0);
  });
});

server.listen(port, host);
