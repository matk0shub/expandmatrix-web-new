'use client';

import TeamCard from './TeamCard';
import { CARD_THEMES, CARD_NARRATIVES } from './constants';
import type { TeamCardsGridProps } from './types';

export default function TeamCardsGrid({ members, locale }: TeamCardsGridProps) {
  return (
    <div className="relative z-40 mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-10 md:flex-row md:flex-nowrap md:gap-12">
      {members.map((member, index) => {
        const theme = CARD_THEMES[index] ?? CARD_THEMES[CARD_THEMES.length - 1];
        const narrative = CARD_NARRATIVES[member.name as keyof typeof CARD_NARRATIVES];

        return (
          <TeamCard
            key={member.id}
            member={member}
            locale={locale}
            narrative={narrative}
            theme={theme}
          />
        );
      })}
    </div>
  );
}

