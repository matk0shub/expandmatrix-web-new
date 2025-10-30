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
    selectReference: t.raw('selectReference'),
    instagram: t('instagram'),
    instagramAria: t.raw('instagramAria'),
    website: t('website'),
    websiteAria: t.raw('websiteAria'),
    impactHeading: t('impactHeading'),
  };

  return (
    <ReferencesSectionClient
      references={references}
      copy={copy}
    />
  );
}
