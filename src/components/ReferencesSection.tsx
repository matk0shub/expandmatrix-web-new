import { getTranslations } from 'next-intl/server';

import ReferencesSectionClient from './ReferencesSectionClient';
import { getReferences } from '@/data/references.server';

interface ReferencesSectionProps {
  locale: string;
}

export default async function ReferencesSection({ locale }: ReferencesSectionProps) {
  const t = await getTranslations({ locale, namespace: 'sections.references' });
  const { references } = await getReferences({
    locale,
    featuredOnly: true,
  });

  const copy = {
    metaName: t('metaName'),
    metaDescription: t('metaDescription'),
    overline: t('overline'),
    selectReference: (name: string) => t('selectReference', { name }),
    instagram: t('instagram'),
    instagramAria: (name: string) => t('instagramAria', { name }),
    website: t('website'),
    websiteAria: (name: string) => t('websiteAria', { name }),
    impactHeading: t('impactHeading'),
  };

  return (
    <ReferencesSectionClient
      references={references}
      copy={copy}
    />
  );
}
