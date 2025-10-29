import { cache } from 'react';
import type { Where } from 'payload';

import { getPayloadClient } from '@/payload/getPayloadClient';
import { getSampleTeamMembers, normalizePayloadTeamMembers } from '@/data/teamMembers';
import type { NormalizedTeamMember, TeamMemberDocument } from '@/types/team';

interface GetTeamMembersOptions {
  locale: string;
  featuredOnly?: boolean;
}

export interface TeamMembersResult {
  members: NormalizedTeamMember[];
  isFallback: boolean;
}

export const getTeamMembers = cache(
  async ({
    locale,
    featuredOnly = false,
  }: GetTeamMembersOptions): Promise<TeamMembersResult> => {
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
      });

      const docs = Array.isArray(result.docs)
        ? (result.docs as TeamMemberDocument[])
        : [];
      const normalized = normalizePayloadTeamMembers(docs, locale);

      if (normalized.length > 0) {
        return { members: normalized, isFallback: false };
      }
    } catch (error) {
      console.error('Team members fetch failed, falling back to samples:', error);
    }

    return {
      members: getSampleTeamMembers({ locale, featuredOnly }),
      isFallback: true,
    };
  },
);
