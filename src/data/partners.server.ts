import { unstable_cache } from 'next/cache';

import { getSamplePartners, normalizePayloadPartners } from '@/data/partners';
import { getPayloadClient } from '@/payload/getPayloadClient';
import { isUsingFallbackDatabase } from '@/payload/env';
import { resolvePayloadQueryTimeout, withTimeout } from '@/payload/timeouts';
import type { NormalizedPartner, PartnerDocument } from '@/types/partners';

export interface PartnersResult {
  partners: NormalizedPartner[];
  isFallback: boolean;
}

let payloadOfflineLogged = false;

const createPayloadTimeoutError = (timeoutMs: number): NodeJS.ErrnoException => {
  const error = new Error(`Payload partners query timed out after ${timeoutMs}ms`) as NodeJS.ErrnoException;
  error.code = 'PAYLOAD_OFFLINE';
  return error;
};

const getPartnersCached = unstable_cache(
  async (): Promise<PartnersResult> => {
  const benchmarkLabel = '[partners] fetch';
  console.time?.(benchmarkLabel);

  try {
    const payload = await getPayloadClient();
    const timeoutMs = isUsingFallbackDatabase() ? resolvePayloadQueryTimeout() : 0;

    const result = await withTimeout(
      payload.find({
        collection: 'partners',
        depth: 1,
        sort: 'order',
        limit: 100,
        where: {
          showOnSite: {
            equals: true,
          },
        },
      }),
      timeoutMs,
      () => createPayloadTimeoutError(timeoutMs),
    );

    const docs = Array.isArray(result.docs)
      ? (result.docs as PartnerDocument[])
      : [];
    const normalized = normalizePayloadPartners(docs);

    return {
      partners: normalized,
      isFallback: false,
    };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException | undefined)?.code;
    if (code === 'PAYLOAD_OFFLINE') {
      if (!payloadOfflineLogged) {
        console.info(
          '[partners] Payload CMS unavailable, serving embedded partners. ' +
            'Set DATABASE_URI to connect to a running Payload instance.',
        );
        payloadOfflineLogged = true;
      }
    } else {
      console.error('Partners fetch failed, falling back to samples:', error);
    }
  } finally {
    console.timeEnd?.(benchmarkLabel);
  }

  return {
    partners: getSamplePartners(),
    isFallback: true,
  };
  },
  ['partners'],
  { revalidate: 60, tags: ['partners'] }
);

export const getPartners = async (): Promise<PartnersResult> => getPartnersCached();
