'use client';

import { useTranslations } from 'next-intl';
import ScrambleText from '@/components/ScrambleText';

export default function TeamSectionHeader() {
  const t = useTranslations('sections.team');

  return (
    <div 
      className="heading-wrapper z-20 pointer-events-none flex w-full max-w-5xl items-center justify-center px-6 mb-20 mx-auto"
      style={{ willChange: 'auto' }}
    >
      <h1 className="team-heading text-center">
        <div className="block whitespace-nowrap">
          <ScrambleText text={t('title.line1')} applyScramble={false} />
        </div>
        <div className="block whitespace-nowrap">
          <ScrambleText text={t('title.line2')} applyScramble={false} />
        </div>
      </h1>
    </div>
  );
}

