import { getTranslations } from 'next-intl/server';
import AccuracySectionClient from './AccuracySectionClient';

interface AccuracySectionProps {
  locale: string;
}

export default async function AccuracySection({ locale }: AccuracySectionProps) {
  const t = await getTranslations({ locale, namespace: 'sections.accuracy' });

  const stats = [
    { value: '35+', label: t('stats.clients') },
    { value: '3+', label: t('stats.years') },
    { value: '5', label: t('stats.team') },
    { value: '50+', label: t('stats.projects') },
  ];

  const copy = {
    titleLine1: t('title.line1'),
    titleLine2: t('title.line2'),
    description: t('description'),
  };

  return (
    <AccuracySectionClient
      stats={stats}
      copy={copy}
    />
  );
}
