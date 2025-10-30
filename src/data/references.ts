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

const createReferenceImage = (id: string, url: string, alt: string) => ({
  id,
  url,
  alt,
  sources: {
    original: { url },
    hero: { url },
    grid: { url },
    tablet: { url },
    card: { url },
    thumbnail: { url },
  },
});

const referenceTranslations: Record<SupportedLocale, ReferenceTranslations> = {
  en: (enMessages.sections?.references?.samples as ReferenceTranslations) ?? {},
  cs: (csMessages.sections?.references?.samples as ReferenceTranslations) ?? {},
};

const baseReferences: BaseReference[] = [
  {
    id: '1',
    name: 'TechStartup',
    slug: 'tech-startup',
    translationKey: 'techStartup',
    instagramUrl: 'https://instagram.com/techstartup',
    websiteUrl: 'https://techstartup.ai',
    image: createReferenceImage(
      'img1',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=960&h=640&q=75',
      'Tech startup office',
    ),
    order: 1,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'FashionBrand',
    slug: 'fashion-brand',
    translationKey: 'fashionBrand',
    instagramUrl: 'https://instagram.com/fashionbrand',
    websiteUrl: 'https://fashionbrand.studio',
    image: createReferenceImage(
      'img2',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=960&h=640&q=75',
      'Fashion brand store',
    ),
    order: 2,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'RestaurantChain',
    slug: 'restaurant-chain',
    translationKey: 'restaurantChain',
    instagramUrl: 'https://instagram.com/restaurantchain',
    websiteUrl: 'https://restaurantchain.digital',
    image: createReferenceImage(
      'img3',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=960&h=640&q=75',
      'Restaurant interior',
    ),
    order: 3,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'HealthTech',
    slug: 'health-tech',
    translationKey: 'healthTech',
    instagramUrl: 'https://instagram.com/healthtech',
    websiteUrl: 'https://healthtech.care',
    image: createReferenceImage(
      'img4',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=960&h=640&q=75',
      'Healthcare technology',
    ),
    order: 4,
    isFeatured: true,
  },
  {
    id: '5',
    name: 'EduPlatform',
    slug: 'edu-platform',
    translationKey: 'eduPlatform',
    instagramUrl: 'https://instagram.com/eduplatform',
    websiteUrl: 'https://eduplatform.academy',
    image: createReferenceImage(
      'img5',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=960&h=640&q=75',
      'Online education',
    ),
    order: 5,
    isFeatured: true,
  },
  {
    id: '6',
    name: 'FinTech',
    slug: 'fin-tech',
    translationKey: 'finTech',
    instagramUrl: 'https://instagram.com/fintech',
    websiteUrl: 'https://fintech.global',
    image: createReferenceImage(
      'img6',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&h=640&q=75',
      'Financial technology',
    ),
    order: 6,
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
