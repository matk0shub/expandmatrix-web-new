/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const jiti = require('jiti')(process.cwd());

module.exports = jiti(path.resolve(process.cwd(), 'payload.config.ts')).default;
