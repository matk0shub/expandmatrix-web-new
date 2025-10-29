const { resolveAuditUrl } = require('./scripts/resolve-audit-url');

module.exports = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
    screenEmulation: {
      mobile: true,
      disabled: false,
    },
    throttlingMethod: 'simulate',
    locale: 'en',
  },
  urls: [resolveAuditUrl()],
};
