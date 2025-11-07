import { NextResponse } from 'next/server';

import { getPayloadClient } from '@/payload/getPayloadClient';

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
  const payloadLocale = resolveLocale(localeParam) ?? 'all';

  try {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: 'references',
      depth: 2,
      sort: 'order',
      limit: 100,
      locale: payloadLocale,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching references from Payload:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch references from Payload CMS',
      },
      { status: 503 },
    );
  }
}
