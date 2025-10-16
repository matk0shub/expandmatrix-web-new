const { resolveAuditUrl } = require('./scripts/resolve-audit-url');

module.exports = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      disabled: false,
    },
    locale: 'en',
  },
  urls: [resolveAuditUrl()],
};
