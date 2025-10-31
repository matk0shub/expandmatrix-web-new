import { getTranslations } from 'next-intl/server';

import ServicesSectionClient from './ServicesSectionClient';

interface ServicesSectionProps {
  locale: string;
}

export default async function ServicesSection({ locale }: ServicesSectionProps) {
  const t = await getTranslations({ locale, namespace: 'sections.services' });

  const copy = {
    title: t('title'),
    services: [
      {
        key: 'ai-agents',
        number: t('services.ai-agents.number'),
        title: t('services.ai-agents.title'),
        description: t('services.ai-agents.description'),
      },
      {
        key: 'web-development',
        number: t('services.web-development.number'),
        title: t('services.web-development.title'),
        description: t('services.web-development.description'),
      },
      {
        key: 'ai-implementation',
        number: t('services.ai-implementation.number'),
        title: t('services.ai-implementation.title'),
        description: t('services.ai-implementation.description'),
      },
    ],
  };

  return <ServicesSectionClient copy={copy} />;
}
