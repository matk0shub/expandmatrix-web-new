import { NextResponse } from 'next/server';
import type { Where } from 'payload';

import { getPayloadClient } from '@/payload/getPayloadClient';
import { getSampleReferencesResponse } from '@/data/references';

const resolveLocale = (raw: string | null): 'en' | 'cs' | undefined => {
  if (!raw) {
    return undefined;
  }

  const normalized = raw.toLowerCase();
  if (normalized.startsWith('cs')) {
    return 'cs';
  }
  if (normalized.startsWith('en')) {
    return 'en';
  }
  return undefined;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get('locale');
  const featuredOnly = searchParams.get('featuredOnly') === 'true';
  const payloadLocale = resolveLocale(localeParam) ?? 'all';

  try {
    const payload = await getPayloadClient();

    const where: Where | undefined = featuredOnly
      ? {
          isFeatured: {
            equals: true,
          },
        }
      : undefined;

    const result = await payload.find({
      collection: 'references',
      depth: 2,
      sort: 'order',
      limit: 100,
      locale: payloadLocale,
      where,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching references from Payload:', error);
    const fallback = getSampleReferencesResponse(localeParam ?? undefined);

    if (featuredOnly) {
      fallback.docs = fallback.docs.filter((doc) => doc.isFeatured);
    }

    return NextResponse.json(fallback);
  }
}
