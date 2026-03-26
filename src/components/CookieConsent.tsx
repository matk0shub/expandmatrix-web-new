'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as CookieConsent from 'vanilla-cookieconsent';
import { getCookieConsentConfig } from '@/lib/cookieconsent-config';

export default function CookieConsentBanner() {
  const locale = useLocale();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    CookieConsent.run(getCookieConsentConfig(locale));
  }, [locale]);

  return null;
}

export { CookieConsent };
