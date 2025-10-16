const { resolveAuditUrl } = require('./scripts/resolve-audit-url');

module.exports = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
    screenEmulation: {
      mobile: false,
      width: 834,
      height: 1194,
      deviceScaleFactor: 2,
      disabled: false,
    },
    locale: 'en',
  },
  urls: [resolveAuditUrl()],
};
