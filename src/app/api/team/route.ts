import { NextResponse } from 'next/server';
import type { Where } from 'payload';

import { getPayloadClient } from '@/payload/getPayloadClient';
import { getSampleTeamResponse } from '@/data/teamMembers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get('featuredOnly') === 'true';
  const locale = searchParams.get('locale') || 'en';

  try {
    const payload = await getPayloadClient();

    const where: Where =
      featuredOnly
        ? {
            and: [
              {
                showOnSite: { equals: true },
              },
              {
                featured: { equals: true },
              },
            ],
          }
        : {
            showOnSite: { equals: true },
          };

    const result = await payload.find({
      collection: 'teamMembers',
      depth: 1,
      sort: 'order',
      limit: 100,
      where,
      locale: locale as 'en' | 'cs',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching team members from Payload:', error);
    return NextResponse.json(getSampleTeamResponse({ featuredOnly }));
  }
}
