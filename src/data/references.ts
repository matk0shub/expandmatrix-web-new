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
    name: 'Ubytování Horňácko',
    slug: 'ubytovani-hornacko',
    translationKey: 'ubytovaniHornacko',
    instagramUrl: 'https://instagram.com/ubytovani_hornacko',
    websiteUrl: 'https://ubytovani-hornacko.cz',
    image: {
      id: 'img1',
      url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&h=800&fit=crop',
      alt: 'Ubytování Horňácko exterior',
    },
    order: 1,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'AC Klimeš',
    slug: 'ac-klimes',
    translationKey: 'acKlimes',
    instagramUrl: 'https://instagram.com/ac_klimes',
    websiteUrl: 'https://acklimes.cz',
    image: {
      id: 'img2',
      url: 'https://images.unsplash.com/photo-1503389152951-9f343605f61e?w=1200&h=800&fit=crop',
      alt: 'HVAC technician working',
    },
    order: 2,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Apex MMA Gym',
    slug: 'apex-mma-gym',
    translationKey: 'apexMma',
    instagramUrl: 'https://www.instagram.com/apexmmagym/',
    websiteUrl: 'https://apexmmagym.com',
    image: {
      id: 'img3',
      url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=800&fit=crop',
      alt: 'MMA gym training session',
    },
    order: 3,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Nova Clinic',
    slug: 'nova-clinic',
    translationKey: 'novaClinic',
    instagramUrl: 'https://instagram.com/novaclinic',
    websiteUrl: 'https://novaclinic.eu',
    image: {
      id: 'img4',
      url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=1200&h=800&fit=crop',
      alt: 'Clinic interior',
    },
    order: 4,
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Expando Logistics',
    slug: 'expando-logistics',
    translationKey: 'expandoLogistics',
    instagramUrl: 'https://instagram.com/expando',
    websiteUrl: 'https://expando-logistics.com',
    image: {
      id: 'img5',
      url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&h=800&fit=crop',
      alt: 'Logistics warehouse',
    },
    order: 5,
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
