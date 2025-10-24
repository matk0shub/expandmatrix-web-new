'use client';

import { useState, useEffect } from 'react';
import type { NormalizedTeamMember, TeamMemberDocument } from '@/types/team';
import {
  getSampleTeamMembers,
  normalizePayloadTeamMembers,
} from '@/data/teamMembers';

interface UseTeamMembersOptions {
  locale: string;
  featuredOnly?: boolean;
}

export function useTeamMembers({ locale, featuredOnly = false }: UseTeamMembersOptions) {
  const [teamMembers, setTeamMembers] = useState<NormalizedTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          locale,
        });

        if (featuredOnly) {
          params.set('featuredOnly', 'true');
        }

        const response = await fetch(`/api/team?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch team members: ${response.statusText}`);
        }

        const payloadResponse = await response.json();
        const docs: TeamMemberDocument[] = Array.isArray(payloadResponse.docs)
          ? payloadResponse.docs
          : Array.isArray(payloadResponse)
          ? payloadResponse
          : [];

        const normalized = normalizePayloadTeamMembers(docs, locale);

        if (normalized.length === 0) {
          setTeamMembers(getSampleTeamMembers({ locale, featuredOnly }));
        } else {
          setTeamMembers(normalized);
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        if (!controller.signal.aborted) {
          setError('Failed to fetch team members');
          setTeamMembers(getSampleTeamMembers({ locale, featuredOnly }));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTeamMembers();

    return () => controller.abort();
  }, [locale, featuredOnly]);

  return {
    teamMembers,
    loading,
    error
  };
}

export type TeamMember = NormalizedTeamMember;
