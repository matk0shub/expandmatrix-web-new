import { unstable_cache } from 'next/cache';

import { getPayloadClient } from '@/payload/getPayloadClient';
import type { Reference } from '@/types/references';
import { resolveMediaUrl } from '@/utils/resolveMediaUrl';

interface PayloadReference {
  id?: string | number;
  name?: string;
  slug?: string;
  subtitle?: string;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  imagePath?: string | null;
  imageAlt?: string | null;
  image?: Record<string, unknown> | string | null; // legacy uploader
  metrics?: Array<Record<string, unknown>>;
  order?: number | null;
}

const ensureString = (value: unknown, preferredLocale?: string): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (preferredLocale && typeof record[preferredLocale] === 'string') {
      return record[preferredLocale] as string;
    }
    const fallbacks = preferredLocale === 'cs' ? ['en'] : ['cs', 'en'];
    for (const key of fallbacks) {
      if (typeof record[key] === 'string') {
        return record[key] as string;
      }
    }
    for (const candidate of Object.values(record)) {
      if (typeof candidate === 'string') {
        return candidate;
      }
    }
  }

  return '';
};

const resolveLegacyImage = (
  image: PayloadReference['image'],
  locale: string,
): Reference['image'] | null => {
  if (!image) {
    return null;
  }

  if (typeof image === 'string') {
    const url = resolveMediaUrl(image);
    return url ? { id: image, url, alt: undefined } : null;
  }

  if (typeof image !== 'object') {
    return null;
  }

  const id = ensureString(image.id);
  const alt = ensureString(image.alt, locale);

  const findUrl = (): string => {
    if (typeof image.url === 'string') {
      return image.url;
    }

    if (image.sizes && typeof image.sizes === 'object') {
      const sizes = image.sizes as Record<string, unknown>;
      for (const size of Object.values(sizes)) {
        if (size && typeof size === 'object' && typeof (size as Record<string, unknown>).url === 'string') {
          return (size as Record<string, unknown>).url as string;
        }
      }
    }

    if (typeof image.filename === 'string') {
      return `/media/${image.filename}`;
    }

    return '';
  };

  const url = resolveMediaUrl(findUrl());

  if (!url) {
    return null;
  }

  return {
    id: id || url,
    url,
    alt: alt || undefined,
  };
};

const missingReferenceImages = new Set<string>();

const resolveImageFromPath = (
  doc: PayloadReference,
  locale: string,
): Reference['image'] | null => {
  const rawPath = ensureString(doc.imagePath);
  if (!rawPath) {
    return null;
  }

  const url = resolveMediaUrl(rawPath);
  if (!url) {
    return null;
  }

  const fallbackAlt = ensureString(doc.imageAlt) || ensureString(doc.subtitle, locale) || ensureString(doc.name, locale);

  return {
    id: ensureString(doc.slug) || url,
    url,
    alt: fallbackAlt || undefined,
  };
};

const normalizeReferences = (docs: PayloadReference[], locale: string): Reference[] => {
  const normalized: Reference[] = [];

  docs.forEach((doc) => {
    const name = ensureString(doc.name, locale);
    const slug = ensureString(doc.slug);

    if (!name || !slug) {
      return;
    }

    let image = resolveImageFromPath(doc, locale);

    if (!image) {
      image = resolveLegacyImage(doc.image, locale);
    }

    if (!image) {
      if (!missingReferenceImages.has(slug)) {
        console.warn(
          `[references] Missing media asset for "${slug}". Using gradient fallback. ` +
            'Přidej obrázek do public/images/reference a spusť script scripts/seed-references.mjs.',
        );
        missingReferenceImages.add(slug);
      }

      image = {
        id: String(doc.id ?? slug),
        url: '',
        alt: ensureString(doc.subtitle, locale) || name,
      };
    }

    const metrics = Array.isArray(doc.metrics)
      ? doc.metrics
          .map((metric) => ({
            label: ensureString(metric?.label, locale),
            value: ensureString(metric?.value, locale),
          }))
          .filter((metric) => metric.label && metric.value)
      : [];

    normalized.push({
      id: String(doc.id ?? slug),
      name,
      slug,
      subtitle: ensureString(doc.subtitle, locale) || undefined,
      instagramUrl: ensureString(doc.instagramUrl) || undefined,
      websiteUrl: ensureString(doc.websiteUrl) || undefined,
      image,
      metrics,
      order: typeof doc.order === 'number' ? doc.order : Number(doc.order ?? 0),
    });
  });

  return normalized;
};

const resolveLocale = (locale: string): 'en' | 'cs' =>
  locale?.toLowerCase().startsWith('cs') ? 'cs' : 'en';

interface GetReferencesOptions {
  locale: string;
}

export interface ReferencesResult {
  references: Reference[];
}

const getReferencesCached = unstable_cache(
  async (locale: string): Promise<ReferencesResult> => {
    const payload = await getPayloadClient();
    const resolvedLocale = resolveLocale(locale);

    const result = await payload.find({
      collection: 'references',
      depth: 2,
      sort: 'order',
      limit: 100,
      locale: 'all',
    });

    const docs = Array.isArray(result.docs)
      ? (result.docs as unknown as PayloadReference[])
      : [];
    const references = normalizeReferences(docs, resolvedLocale);

    if (!references.length) {
      console.warn('[references] No references were returned from Payload CMS.');
    }

    return { references };
  },
  ['references'],
  { revalidate: false, tags: ['references'] },
);

export const getReferences = async ({ locale }: GetReferencesOptions): Promise<ReferencesResult> =>
  getReferencesCached(locale);
