import { unstable_cache } from 'next/cache';

import { normalizePayloadPartners } from '@/data/partners';
import { getPayloadClient } from '@/payload/getPayloadClient';
import type { NormalizedPartner, PartnerDocument } from '@/types/partners';

export interface PartnersResult {
  partners: NormalizedPartner[];
}

const getPartnersCached = unstable_cache(
  async (): Promise<PartnersResult> => {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: 'partners',
      depth: 1,
      sort: 'order',
      limit: 100,
      where: {
        showOnSite: {
          equals: true,
        },
      },
    });

    const docs = Array.isArray(result.docs) ? (result.docs as PartnerDocument[]) : [];
    const normalized = normalizePayloadPartners(docs);

    if (!normalized.length) {
      console.warn('[partners] No partners were returned from Payload CMS.');
    }

    return {
      partners: normalized,
    };
  },
  ['partners'],
  { revalidate: 60, tags: ['partners'] },
);

export const getPartners = async (): Promise<PartnersResult> => getPartnersCached();
