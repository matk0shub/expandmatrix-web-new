import { NextResponse } from 'next/server';

import { getPayloadClient } from '@/payload/getPayloadClient';
import type { TeamMemberDocument } from '@/types/team';
import { normalizePayloadTeamMembers } from '@/data/teamMembers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get('locale');
  const featuredOnly = searchParams.get('featuredOnly') === 'true';
  const locale = localeParam?.toLowerCase().startsWith('cs') ? 'cs' : 'en';

  try {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: 'team',
      depth: 1,
      sort: 'order',
      limit: 100,
      locale: 'all',
      where: featuredOnly
        ? {
            featured: {
              equals: true,
            },
          }
        : undefined,
    });

    const docs = Array.isArray(result.docs) ? (result.docs as TeamMemberDocument[]) : [];
    const normalized = normalizePayloadTeamMembers(docs, locale);

    return NextResponse.json({ docs: normalized });
  } catch (error) {
    console.error('Error fetching team members from Payload:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch team members from Payload CMS',
      },
      { status: 503 },
    );
  }
}
