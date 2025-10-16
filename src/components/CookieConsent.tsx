'use client';

import { useTranslations } from 'next-intl';
import CookieConsent from 'react-cookie-consent';

export default function CookieConsentBanner() {
  const t = useTranslations('cookie');

  return (
    <CookieConsent
      location="bottom"
      buttonText={t('buttonText')}
      cookieName="expandmatrix-cookie-consent"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: '16px',
        margin: '16px',
        padding: '20px',
        fontSize: '14px',
        color: '#374151',
        zIndex: 9999
      }}
      buttonStyle={{
        background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%)',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
      buttonClasses="hover:scale-105 hover:shadow-lg transition-all duration-300"
      expires={150}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{t('title')}</h4>
          <p className="text-sm text-gray-600">
            {t('message')}
          </p>
        </div>
      </div>
    </CookieConsent>
  );
}
