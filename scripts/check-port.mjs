#!/usr/bin/env node

import net from 'node:net';

const port = Number(process.argv[2] ?? '3000');
const host = process.env.DEV_HOST ?? '0.0.0.0';

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
