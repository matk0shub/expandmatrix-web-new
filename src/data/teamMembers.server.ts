import { unstable_cache } from 'next/cache';
import type { Where } from 'payload';

import { getPayloadClient } from '@/payload/getPayloadClient';
import { normalizePayloadTeamMembers } from '@/data/teamMembers';
import teamMembersFallback from '@/data/teamMembers.json' assert { type: 'json' };
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

    const fetchFromPayload = async () => {
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
      return normalized;
    }

    try {
      const normalized = await fetchFromPayload();

      if (!normalized.length) {
        console.warn('[team] No team members were returned from Payload CMS.');
      }

      const members = featuredOnly ? normalized.filter((member) => member.featured) : normalized;
      return { members };
    } catch (error) {
      console.warn('[team] Payload CMS unavailable, using fallback team data.', error);
      const fallbackDocs = teamMembersFallback as TeamMemberDocument[];
      const fallbackNormalized = normalizePayloadTeamMembers(fallbackDocs, locale);
      const members = featuredOnly ? fallbackNormalized.filter((member) => member.featured) : fallbackNormalized;
      return { members };
    }
  },
  ['team-members'],
  { revalidate: 60, tags: ['team-members'] },
);

export const getTeamMembers = async ({
  locale,
  featuredOnly = false,
}: GetTeamMembersOptions): Promise<TeamMembersResult> => getTeamMembersCached(locale, featuredOnly ? '1' : '0');
