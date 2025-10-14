'use client';

import { useState, useEffect } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  role: {
    cs: string;
    en: string;
  };
  avatar?: {
    url: string;
    alt: string;
  };
  order: number;
  featured: boolean;
}

interface UseTeamMembersOptions {
  locale: string;
  featuredOnly?: boolean;
}

export function useTeamMembers({ locale, featuredOnly = false }: UseTeamMembersOptions) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        // For now, return mock data until Payload CMS is set up
        // This will be replaced with actual API calls
        const mockTeamMembers: TeamMember[] = [
          {
            id: '1',
            name: 'Matěj Štipčák',
            role: {
              cs: 'Founder & CEO',
              en: 'Founder & CEO'
            },
            avatar: undefined,
            order: 1,
            featured: true
          },
          {
            id: '2',
            name: 'Matěj Venclík',
            role: {
              cs: 'Founder & CEO',
              en: 'Founder & CEO'
            },
            avatar: undefined,
            order: 2,
            featured: true
          },
          {
            id: '3',
            name: 'Jakub Hrůza',
            role: {
              cs: 'COO',
              en: 'COO'
            },
            avatar: undefined,
            order: 3,
            featured: true
          },
          {
            id: '4',
            name: 'Marek Buňata',
            role: {
              cs: 'Senior Ads Specialist',
              en: 'Senior Ads Specialist'
            },
            avatar: undefined,
            order: 4,
            featured: true
          },
          {
            id: '5',
            name: 'Julie Kolářová',
            role: {
              cs: 'Web Specialist',
              en: 'Web Specialist'
            },
            avatar: undefined,
            order: 5,
            featured: true
          },
          {
            id: '6',
            name: 'Nikol Skálová',
            role: {
              cs: 'Creative Manager',
              en: 'Creative Manager'
            },
            avatar: undefined,
            order: 6,
            featured: true
          },
          {
            id: '7',
            name: 'David Tran',
            role: {
              cs: 'AI Engineer',
              en: 'AI Engineer'
            },
            avatar: undefined,
            order: 7,
            featured: true
          },
          {
            id: '8',
            name: 'Anna Kratochvílová',
            role: {
              cs: 'UX/UI Designer',
              en: 'UX/UI Designer'
            },
            avatar: undefined,
            order: 8,
            featured: true
          }
        ];

        // Filter by featured if requested
        const filteredMembers = featuredOnly 
          ? mockTeamMembers.filter(member => member.featured)
          : mockTeamMembers;

        // Sort by order
        const sortedMembers = filteredMembers.sort((a, b) => a.order - b.order);

        setTeamMembers(sortedMembers);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to fetch team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [locale, featuredOnly]);

  return {
    teamMembers,
    loading,
    error
  };
}
