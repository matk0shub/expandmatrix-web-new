export const COOKIE_CONSENT_NAME = 'expandmatrix-cookie-consent';
export const COOKIE_RESET_EVENT = 'expandmatrix:cookie-consent-reset';

export const clearCookieConsent = (): void => {
  document.cookie = `${COOKIE_CONSENT_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
