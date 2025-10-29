import { cache } from 'react';
import type { Where } from 'payload';

import { getPayloadClient } from '@/payload/getPayloadClient';
import { isUsingFallbackDatabase } from '@/payload/env';
import { resolvePayloadQueryTimeout, withTimeout } from '@/payload/timeouts';
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

let payloadOfflineLogged = false;
const createPayloadTimeoutError = (timeoutMs: number): NodeJS.ErrnoException => {
  const error = new Error(`Payload team members query timed out after ${timeoutMs}ms`) as NodeJS.ErrnoException;
  error.code = 'PAYLOAD_OFFLINE';
  return error;
};

export const getTeamMembers = cache(
  async ({
    locale,
    featuredOnly = false,
  }: GetTeamMembersOptions): Promise<TeamMembersResult> => {
    const benchmarkLabel = `[team] fetch (locale=${locale}, featuredOnly=${featuredOnly})`;
    console.time?.(benchmarkLabel);
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

      const timeoutMs = isUsingFallbackDatabase() ? resolvePayloadQueryTimeout() : 0;
      const result = await withTimeout(
        payload.find({
          collection: 'teamMembers',
          depth: 1,
          sort: 'order',
          limit: 100,
          where,
        }),
        timeoutMs,
        () => createPayloadTimeoutError(timeoutMs),
      );

      const docs = Array.isArray(result.docs)
        ? (result.docs as TeamMemberDocument[])
        : [];
      const normalized = normalizePayloadTeamMembers(docs, locale);

      if (normalized.length > 0) {
        return { members: normalized, isFallback: false };
      }
    } catch (error) {
      const code = (error as NodeJS.ErrnoException | undefined)?.code;
      if (code === 'PAYLOAD_OFFLINE') {
        if (!payloadOfflineLogged) {
          console.info(
            '[team] Payload CMS unavailable, serving embedded team members. ' +
              'Set DATABASE_URI to connect to a running Payload instance.',
          );
          payloadOfflineLogged = true;
        }
      } else {
        console.error('Team members fetch failed, falling back to samples:', error);
      }
    }

    console.timeEnd?.(benchmarkLabel);
    return {
      members: getSampleTeamMembers({ locale, featuredOnly }),
      isFallback: true,
    };
  },
);
