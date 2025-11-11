/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');

const COMPILED_PATH = path.resolve(__dirname, 'payload.config.dist.cjs');

if (fs.existsSync(COMPILED_PATH)) {
  const compiled = require(COMPILED_PATH);
  module.exports = compiled?.default ?? compiled;
} else if (process.env.NODE_ENV !== 'production') {
  const jiti = require('jiti')(__dirname);
  const source = jiti(path.resolve(__dirname, 'payload.config.ts'));
  module.exports = source?.default ?? source;
} else {
  throw new Error(
    'payload.config.dist.cjs missing. Run "npm run payload:compile" before building for production.',
  );
}
