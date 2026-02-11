import enMessages from '@/messages/en.json';
import csMessages from '@/messages/cs.json';
import type { Reference } from '@/types/references';

type SupportedLocale = 'en' | 'cs';

type ReferenceTranslations = Record<
  string,
  {
    subtitle: string;
    metrics: Array<{ label: string; value: string }>;
  }
>;

interface BaseReference extends Omit<Reference, 'subtitle' | 'metrics'> {
  translationKey: string;
}

const referenceTranslations: Record<SupportedLocale, ReferenceTranslations> = {
  en: (enMessages.sections?.references?.samples as ReferenceTranslations) ?? {},
  cs: (csMessages.sections?.references?.samples as ReferenceTranslations) ?? {},
};

const baseReferences: BaseReference[] = [
  {
    id: '1',
    name: 'Apex MMA Gym',
    slug: 'apex-mma-gym',
    translationKey: 'apexMma',
    instagramUrl: 'https://www.instagram.com/apexmmagym/',
    websiteUrl: 'https://www.apexmma.cz/',
    image: {
      id: 'img1',
      url: '/images/reference/apex_gym_new.webp',
      alt: 'MMA gym training session',
    },
    order: 1,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Tarifix.cz',
    slug: 'tarifix',
    translationKey: 'tarifix',
    instagramUrl: 'https://www.instagram.com/tarifix_cz/',
    websiteUrl: 'https://www.tarifix.cz/',
    image: {
      id: 'img2',
      url: '/images/reference/tarifix.webp',
      alt: 'Tarifix telecom comparison',
    },
    order: 2,
    isFeatured: true,
  },
];

function resolveLocale(locale: string | undefined): SupportedLocale {
  return locale?.toLowerCase().startsWith('cs') ? 'cs' : 'en';
}

function getLocalizedReference(translationKey: string, locale: SupportedLocale) {
  const fallback = referenceTranslations.en[translationKey];
  const localized = referenceTranslations[locale][translationKey] ?? fallback;

  return localized ?? { subtitle: '', metrics: [] };
}

export function getSampleReferences(locale?: string): Reference[] {
  const resolvedLocale = resolveLocale(locale);

  return baseReferences.map(({ translationKey, ...reference }) => {
    const localized = getLocalizedReference(translationKey, resolvedLocale);

    return {
      ...reference,
      subtitle: localized.subtitle,
      metrics: localized.metrics.map((metric) => ({
        label: metric.label,
        value: metric.value,
      })),
    };
  });
}

export function getSampleReferencesResponse(locale?: string) {
  const references = getSampleReferences(locale);
  return {
    docs: references,
    totalDocs: references.length,
    limit: references.length,
    totalPages: 1,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };
}
