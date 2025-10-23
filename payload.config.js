/* eslint-disable @typescript-eslint/no-require-imports */
const jiti = require('jiti')(__filename);

module.exports = jiti('./payload.config.ts').default;
