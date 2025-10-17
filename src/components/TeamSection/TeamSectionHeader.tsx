'use client';

import { useTranslations } from 'next-intl';

export default function TeamSectionHeader() {
  const t = useTranslations('sections.team');

  return (
    <div className="flex w-full flex-col items-center gap-6 text-center">
      <h2 
        className="team-heading text-balance text-white"
        style={{ 
          transform: 'none',
          willChange: 'auto',
          transition: 'none'
        }}
      >
        <div>{t('title.line1')}</div>
        <div>{t('title.line2')}</div>
      </h2>
    </div>
  );
}

