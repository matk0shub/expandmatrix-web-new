import { unstable_cache } from 'next/cache';
import type { Where } from 'payload';

import { getPayloadClient } from '@/payload/getPayloadClient';
import { normalizePayloadTeamMembers } from '@/data/teamMembers';
import type { NormalizedTeamMember, TeamMemberDocument } from '@/types/team';

interface GetTeamMembersOptions {
  locale: string;
  featuredOnly?: boolean;
}

export interface TeamMembersResult {
  members: NormalizedTeamMember[];
}

const getTeamMembersCached = unstable_cache(
  async (
    locale: string,
    featuredKey: string,
  ): Promise<TeamMembersResult> => {
    const featuredOnly = featuredKey === '1'
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
    });

    const docs = Array.isArray(result.docs) ? (result.docs as TeamMemberDocument[]) : [];
    const normalized = normalizePayloadTeamMembers(docs, locale);

    if (!normalized.length) {
      console.warn('[team] No team members were returned from Payload CMS.');
    }

    return { members: normalized };
  },
  ['team-members'],
  { revalidate: 60, tags: ['team-members'] },
);

export const getTeamMembers = async ({
  locale,
  featuredOnly = false,
}: GetTeamMembersOptions): Promise<TeamMembersResult> => getTeamMembersCached(locale, featuredOnly ? '1' : '0');
