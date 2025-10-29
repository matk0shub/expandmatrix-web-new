import { getTranslations } from 'next-intl/server';

import TeamSectionClient from './TeamSectionClient';
import { getTeamMembers } from '@/data/teamMembers.server';

interface TeamSectionProps {
  locale: string;
}

export default async function TeamSection({ locale }: TeamSectionProps) {
  const t = await getTranslations({ locale, namespace: 'sections.team' });
  const { members, isFallback } = await getTeamMembers({
    locale,
    featuredOnly: true,
  });

  const copy = {
    title: t('title'),
    error: t('error', {
      defaultValue: 'Unable to load team members. Please try again later.',
    }),
    empty: t('empty', {
      defaultValue: 'Team members will appear here once they are published in the CMS.',
    }),
  };

  return (
    <TeamSectionClient
      members={members}
      copy={copy}
      showFallbackNotice={isFallback}
    />
  );
}
