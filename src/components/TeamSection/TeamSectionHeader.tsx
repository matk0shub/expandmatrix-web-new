'use client';

import { useTranslations } from 'next-intl';
import ScrambleText from '@/components/ScrambleText';

export default function TeamSectionHeader() {
  const t = useTranslations('sections.team');

  return (
    <div className="flex w-full flex-col items-center gap-6 text-center">
      <h2 className="team-heading text-balance text-white">
        <div>
          <ScrambleText text={t('title.line1')} applyScramble={false} />
        </div>
        <div>
          <ScrambleText text={t('title.line2')} applyScramble={false} />
        </div>
      </h2>
    </div>
  );
}

