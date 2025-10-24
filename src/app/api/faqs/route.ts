import { NextResponse } from 'next/server';
import type { Where } from 'payload';

import { getPayloadClient } from '@/payload/getPayloadClient';
import { getSampleFAQsResponse } from '@/data/faqs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get('featuredOnly') === 'true';

  try {
    const payload = await getPayloadClient();

    const where: Where = featuredOnly
      ? {
          and: [
            {
              showOnSite: {
                equals: true,
              },
            },
            {
              isFeatured: {
                equals: true,
              },
            },
          ],
        }
      : {
          showOnSite: {
            equals: true,
          },
        };

    const result = await payload.find({
      collection: 'faqs',
      depth: 0,
      sort: 'order',
      limit: 100,
      where,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching FAQs from Payload:', error);
    return NextResponse.json(getSampleFAQsResponse({ featuredOnly }));
  }
}
