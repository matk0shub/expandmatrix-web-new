'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import * as CookieConsent from 'vanilla-cookieconsent';
import { getCookieConsentConfig } from '@/lib/cookieconsent-config';

export default function CookieConsentBanner() {
  const locale = useLocale();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let cancelled = false;

    void (async () => {
      // @ts-expect-error Next.js supports lazy global CSS imports in client components.
      await import('vanilla-cookieconsent/dist/cookieconsent.css');
      if (cancelled) return;
      CookieConsent.run(getCookieConsentConfig(locale));
    })();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return null;
}

export { CookieConsent };
