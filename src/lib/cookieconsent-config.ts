import type CookieConsent from 'vanilla-cookieconsent';

type CookieConsentConfig = Parameters<typeof CookieConsent.run>[0];

export function getCookieConsentConfig(locale: string): CookieConsentConfig {
  return {
    cookie: {
      name: 'em_cc',
      expiresAfterDays: 182,
    },

    guiOptions: {
      consentModal: {
        layout: 'box inline',
        position: 'bottom left',
        equalWeightButtons: true,
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
      },
    },

    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        autoClear: {
          cookies: [
            { name: /^_ga/ },
            { name: '_gid' },
            { name: '_gat' },
          ],
        },
      },
      marketing: {
        autoClear: {
          cookies: [
            { name: '_fbp' },
            { name: 'fr' },
          ],
        },
      },
    },

    language: {
      default: locale === 'cs' ? 'cs' : 'en',
      translations: {
        en: {
          consentModal: {
            title: 'We use cookies',
            description:
              'We use cookies to ensure basic site functionality and to improve your experience. You can choose which categories you allow. For more details, see our <a href="/en/privacy">privacy policy</a>.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Manage preferences',
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'Cookie usage',
                description:
                  'We use cookies to ensure basic site functionality, analyze traffic and provide personalized advertising. You can choose for each category whether you want to allow it.',
              },
              {
                title: 'Strictly necessary cookies',
                description:
                  'These cookies are essential for the website to function properly. They enable basic features such as navigation and access to secure areas. The website cannot function without them.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytics cookies',
                description:
                  'These cookies help us understand how visitors interact with the website by collecting and reporting information anonymously. This helps us improve the site.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: {
                    name: 'Name',
                    domain: 'Domain',
                    description: 'Description',
                    expiration: 'Expiration',
                  },
                  body: [
                    {
                      name: '_ga',
                      domain: 'expandmatrix.com',
                      description: 'Google Analytics \u2014 distinguishes unique users',
                      expiration: '2 years',
                    },
                    {
                      name: '_gid',
                      domain: 'expandmatrix.com',
                      description: 'Google Analytics \u2014 distinguishes unique users',
                      expiration: '24 hours',
                    },
                  ],
                },
              },
              {
                title: 'Marketing cookies',
                description:
                  'These cookies are used to track visitors across websites in order to display relevant ads. They help measure the effectiveness of advertising campaigns.',
                linkedCategory: 'marketing',
                cookieTable: {
                  headers: {
                    name: 'Name',
                    domain: 'Domain',
                    description: 'Description',
                    expiration: 'Expiration',
                  },
                  body: [
                    {
                      name: '_fbp',
                      domain: 'expandmatrix.com',
                      description: 'Facebook Pixel \u2014 identifies browsers for ad targeting',
                      expiration: '3 months',
                    },
                    {
                      name: 'fr',
                      domain: '.facebook.com',
                      description: 'Facebook \u2014 delivers ads and measures relevance',
                      expiration: '3 months',
                    },
                  ],
                },
              },
              {
                title: 'More information',
                description:
                  'For any questions about our cookie policy, please <a href="mailto:info@expandmatrix.com">contact us</a>.',
              },
            ],
          },
        },
        cs: {
          consentModal: {
            title: 'Používáme cookies',
            description:
              'Cookies používáme k zajištění základní funkčnosti webu a ke zlepšení vašeho zážitku. Můžete si vybrat, které kategorie povolíte. Více v našich <a href="/cs/privacy">zásadách ochrany osobních údajů</a>.',
            acceptAllBtn: 'Přijmout vše',
            acceptNecessaryBtn: 'Odmítnout vše',
            showPreferencesBtn: 'Spravovat nastavení',
          },
          preferencesModal: {
            title: 'Nastavení cookies',
            acceptAllBtn: 'Přijmout vše',
            acceptNecessaryBtn: 'Odmítnout vše',
            savePreferencesBtn: 'Uložit nastavení',
            closeIconLabel: 'Zavřít',
            sections: [
              {
                title: 'Použití cookies',
                description:
                  'Cookies používáme k zajištění základní funkčnosti webu, analýze návštěvnosti a poskytování cílené reklamy. U každé kategorie si můžete vybrat, zda ji povolíte.',
              },
              {
                title: 'Nezbytné cookies',
                description:
                  'Tyto cookies jsou nezbytné pro správné fungování webu. Zajišťují základní funkce, jako je navigace a přístup do zabezpečených oblastí. Web bez nich nemůže fungovat.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytické cookies',
                description:
                  'Tyto cookies nám pomáhají porozumět, jak návštěvníci používají web, sběrem anonymních statistik. Díky tomu můžeme web zlepšovat.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: {
                    name: 'Název',
                    domain: 'Doména',
                    description: 'Popis',
                    expiration: 'Expirace',
                  },
                  body: [
                    {
                      name: '_ga',
                      domain: 'expandmatrix.com',
                      description: 'Google Analytics — rozlišuje unikátní uživatele',
                      expiration: '2 roky',
                    },
                    {
                      name: '_gid',
                      domain: 'expandmatrix.com',
                      description: 'Google Analytics — rozlišuje unikátní uživatele',
                      expiration: '24 hodin',
                    },
                  ],
                },
              },
              {
                title: 'Marketingové cookies',
                description:
                  'Tyto cookies slouží ke sledování návštěvníků napříč weby za účelem zobrazování relevantních reklam. Pomáhají měřit efektivitu reklamních kampaní.',
                linkedCategory: 'marketing',
                cookieTable: {
                  headers: {
                    name: 'Název',
                    domain: 'Doména',
                    description: 'Popis',
                    expiration: 'Expirace',
                  },
                  body: [
                    {
                      name: '_fbp',
                      domain: 'expandmatrix.com',
                      description: 'Facebook Pixel — identifikuje prohlížeče pro cílení reklam',
                      expiration: '3 měsíce',
                    },
                    {
                      name: 'fr',
                      domain: '.facebook.com',
                      description: 'Facebook — doručuje reklamy a měří jejich relevanci',
                      expiration: '3 měsíce',
                    },
                  ],
                },
              },
              {
                title: 'Více informací',
                description:
                  'Máte-li jakékoli dotazy k našim zásadám cookies, <a href="mailto:info@expandmatrix.com">kontaktujte nás</a>.',
              },
            ],
          },
        },
      },
    },
  };
}
