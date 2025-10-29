import { cache } from 'react';

import { getPayloadClient } from '@/payload/getPayloadClient';
import { getSampleReferences } from '@/data/references';
import type { Reference } from '@/types/references';

interface PayloadReference {
  id?: string | number;
  name?: string;
  slug?: string;
  subtitle?: string;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  image?: Record<string, unknown> | string | null;
  metrics?: Array<Record<string, unknown>>;
  order?: number | null;
  isFeatured?: boolean | null;
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

const resolveImage = (
  image: PayloadReference['image'],
  locale: string,
): Reference['image'] | null => {
  if (!image) {
    return null;
  }

  if (typeof image === 'string') {
    return { id: image, url: '', alt: undefined };
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

  const url = findUrl();

  if (!url) {
    return null;
  }

  return {
    id: id || url,
    url,
    alt: alt || undefined,
  };
};

const normalizeReferences = (docs: PayloadReference[], locale: string): Reference[] => {
  const normalized: Reference[] = [];

  docs.forEach((doc) => {
    const name = ensureString(doc.name, locale);
    const slug = ensureString(doc.slug);
    const image = resolveImage(doc.image, locale);

    if (!name || !slug || !image) {
      return;
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
      isFeatured: Boolean(doc.isFeatured ?? true),
    });
  });

  return normalized;
};

const resolveLocale = (locale: string): 'en' | 'cs' =>
  locale?.toLowerCase().startsWith('cs') ? 'cs' : 'en';

interface GetReferencesOptions {
  locale: string;
  featuredOnly?: boolean;
}

export interface ReferencesResult {
  references: Reference[];
  isFallback: boolean;
}

export const getReferences = cache(
  async ({ locale, featuredOnly = true }: GetReferencesOptions): Promise<ReferencesResult> => {
    try {
      const payload = await getPayloadClient();
      const resolvedLocale = resolveLocale(locale);
      const payloadLocale = 'all' as const;
      const result = await payload.find({
        collection: 'references',
        depth: 2,
        sort: 'order',
        limit: 100,
        locale: payloadLocale,
        where: featuredOnly
          ? {
              isFeatured: {
                equals: true,
              },
            }
          : undefined,
      });

      const docs = Array.isArray(result.docs)
        ? (result.docs as PayloadReference[])
        : [];
      const references = normalizeReferences(docs, resolvedLocale).map((reference) => ({
        ...reference,
        isFeatured: featuredOnly ? reference.isFeatured : reference.isFeatured,
      }));

      if (references.length > 0) {
        return { references, isFallback: false };
      }
    } catch (error) {
      console.error('References fetch failed, falling back to samples:', error);
    }

    return {
      references: getSampleReferences(resolveLocale(locale)),
      isFallback: true,
    };
  },
);
