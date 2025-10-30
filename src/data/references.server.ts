import { cache } from 'react';

import { getPayloadClient } from '@/payload/getPayloadClient';
import { isUsingFallbackDatabase } from '@/payload/env';
import { resolvePayloadQueryTimeout, withTimeout } from '@/payload/timeouts';
import { getSampleReferences } from '@/data/references';
import type { Reference } from '@/types/references';
import { resolveMediaUrl } from '@/utils/resolveMediaUrl';

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

const ensureNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;

const ensureOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined;

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

  const rawOriginalUrl =
    typeof image.url === 'string'
      ? image.url
      : typeof image.filename === 'string'
      ? `/media/${image.filename}`
      : '';

  const originalUrl = resolveMediaUrl(rawOriginalUrl);

  const sizeRecord =
    image.sizes && typeof image.sizes === 'object' ? (image.sizes as Record<string, unknown>) : undefined;

  type ReferenceImageSources = NonNullable<Reference['image']['sources']>;

  const toVariant = (value: unknown): ReferenceImageSources[keyof ReferenceImageSources] | undefined => {
    if (!value || typeof value !== 'object') {
      return undefined;
    }
    const record = value as Record<string, unknown>;
    const urlCandidate = resolveMediaUrl(ensureString(record.url));
    if (!urlCandidate) {
      return undefined;
    }
    return {
      url: urlCandidate,
      width: ensureNumber(record.width),
      height: ensureNumber(record.height),
      filesize: ensureNumber(record.filesize),
      mimeType: ensureOptionalString(record.mimeType),
    };
  };

  const hero = toVariant(sizeRecord?.hero);
  const grid = toVariant(sizeRecord?.grid);
  const tablet = toVariant(sizeRecord?.tablet);
  const card = toVariant(sizeRecord?.card);
  const thumbnail = toVariant(sizeRecord?.thumbnail);

  const original = originalUrl
    ? {
        url: originalUrl,
        width: ensureNumber(image.width),
        height: ensureNumber(image.height),
        filesize: ensureNumber(image.filesize),
        mimeType: ensureOptionalString(image.mimeType),
      }
    : undefined;

  const preferredUrl = hero?.url ?? grid?.url ?? tablet?.url ?? card?.url ?? original?.url ?? thumbnail?.url;

  const url = preferredUrl ?? '';

  if (!url) {
    return null;
  }

  const sources = {
    ...(original ? { original } : {}),
    ...(hero ? { hero } : {}),
    ...(grid ? { grid } : {}),
    ...(tablet ? { tablet } : {}),
    ...(card ? { card } : {}),
    ...(thumbnail ? { thumbnail } : {}),
  } satisfies Reference['image']['sources'];

  return {
    id: id || url,
    url,
    alt: alt || undefined,
    sources: Object.keys(sources).length ? sources : undefined,
  };
};

const missingReferenceImages = new Set<string>();

const normalizeReferences = (docs: PayloadReference[], locale: string): Reference[] => {
  const normalized: Reference[] = [];

  docs.forEach((doc) => {
    const name = ensureString(doc.name, locale);
    const slug = ensureString(doc.slug);

    if (!name || !slug) {
      return;
    }

    let image = resolveImage(doc.image, locale);

    if (!image) {
      if (!missingReferenceImages.has(slug)) {
        console.warn(
          `[references] Missing media asset for "${slug}". Using gradient fallback. ` +
            'Upload an image in Payload > Media and re-run the references seed to restore visuals.',
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

let payloadOfflineLogged = false;
const createPayloadTimeoutError = (timeoutMs: number): NodeJS.ErrnoException => {
  const error = new Error(`Payload references query timed out after ${timeoutMs}ms`) as NodeJS.ErrnoException;
  error.code = 'PAYLOAD_OFFLINE';
  return error;
};

export const getReferences = cache(
  async ({ locale, featuredOnly = true }: GetReferencesOptions): Promise<ReferencesResult> => {
    const benchmarkLabel = `[references] fetch (locale=${locale}, featuredOnly=${featuredOnly})`;
    console.time?.(benchmarkLabel);
    try {
      const payload = await getPayloadClient();
      const resolvedLocale = resolveLocale(locale);
      const payloadLocale = 'all' as const;
      const timeoutMs = isUsingFallbackDatabase() ? resolvePayloadQueryTimeout() : 0;
      const result = await withTimeout(
        payload.find({
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
        }),
        timeoutMs,
        () => createPayloadTimeoutError(timeoutMs),
      );

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
      const code = (error as NodeJS.ErrnoException | undefined)?.code;
      if (code === 'PAYLOAD_OFFLINE') {
        if (!payloadOfflineLogged) {
          console.info(
            '[references] Payload CMS unavailable, serving embedded sample references. ' +
              'Set DATABASE_URI to connect to a running Payload instance.'
          );
          payloadOfflineLogged = true;
        }
      } else {
        console.error('References fetch failed, falling back to samples:', error);
      }
    } finally {
      console.timeEnd?.(benchmarkLabel);
    }

    return {
      references: getSampleReferences(resolveLocale(locale)),
      isFallback: true,
    };
  },
);
