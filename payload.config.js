/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');

const COMPILED_PATH = path.resolve(process.cwd(), '.payload', 'build', 'payload.config.js');

if (fs.existsSync(COMPILED_PATH)) {
  const compiled = require(COMPILED_PATH);
  module.exports = compiled?.default ?? compiled;
} else {
  const jiti = require('jiti')(process.cwd());
  const source = jiti(path.resolve(process.cwd(), 'payload.config.ts'));
  module.exports = source?.default ?? source;
}
