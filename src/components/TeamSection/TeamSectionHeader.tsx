'use client';

import { useTranslations } from 'next-intl';
import ScrambleText from '@/components/ScrambleText';

export default function TeamSectionHeader() {
  const t = useTranslations('sections.team');

  return (
    <div className="heading-wrapper mx-auto flex w-full max-w-4xl items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
        <div className="block">
          <ScrambleText text={t('title.line1')} applyScramble={false} />
        </div>
        <div className="block">
          <ScrambleText text={t('title.line2')} applyScramble={false} />
        </div>
      </h1>
    </div>
  );
}
