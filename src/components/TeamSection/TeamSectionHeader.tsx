'use client';

import { useTranslations } from 'next-intl';
import ScrambleText from '@/components/ScrambleText';

export default function TeamSectionHeader() {
  const t = useTranslations('sections.team');

  return (
    <div className="heading-wrapper flex w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
      <h2 className="team-heading whitespace-normal text-balance">
        <div className="block">
          <ScrambleText text={t('title.line1')} applyScramble={false} />
        </div>
        <div className="block">
          <ScrambleText text={t('title.line2')} applyScramble={false} />
        </div>
      </h2>
    </div>
  );
}

