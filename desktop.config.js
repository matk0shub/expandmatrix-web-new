const { resolveAuditUrl } = require('./scripts/resolve-audit-url');

module.exports = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
    screenEmulation: {
      mobile: false,
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    locale: 'en',
  },
  urls: [resolveAuditUrl()],
};
