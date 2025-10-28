import teamMembersJson from './teamMembers.json';
import type { NormalizedTeamMember, TeamMemberDocument } from '@/types/team';

const baseTeamMembers = teamMembersJson as TeamMemberDocument[];

function localizedValue(
  value: string | Record<string, string | undefined> | undefined,
  locale: string,
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value.cs ?? value.en ?? '';
}

function normalizeFocus(doc: TeamMemberDocument, locale: string): string[] {
  return (
    doc.focus
      ?.map((item) => localizedValue(item.label, locale))
      .filter((item): item is string => Boolean(item)) ?? []
  );
}

export function normalizePayloadTeamMembers(
  docs: TeamMemberDocument[],
  locale: string,
): NormalizedTeamMember[] {
  return docs
    .map((doc) => {
      const avatar =
        typeof doc.avatar === 'string'
          ? { url: doc.avatar }
          : doc.avatar?.url
          ? {
              url: doc.avatar.url,
              alt: doc.avatar.alt ?? localizedValue(doc.name, locale),
            }
          : undefined;

      return {
        id: doc.id,
        name: localizedValue(doc.name, locale),
        role: localizedValue(doc.role, locale),
        bio: localizedValue(doc.bio, locale),
        focus: normalizeFocus(doc, locale),
        accent: doc.accent,
        socials: doc.socials ?? {},
        avatar,
        order: doc.order,
        featured: doc.featured,
        showOnSite: doc.showOnSite ?? true,
      };
    })
    .filter((member) => member.showOnSite);
}

export function getSampleTeamResponse(options: { featuredOnly?: boolean } = {}) {
  const { featuredOnly = false } = options;
  const docs = baseTeamMembers
    .filter((member) => member.showOnSite ?? true)
    .filter((member) => (featuredOnly ? member.featured : true))
    .sort((a, b) => a.order - b.order);

  return {
    docs,
    totalDocs: docs.length,
    limit: docs.length,
    totalPages: 1,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };
}

export function getSampleTeamMembers(options: { locale: string; featuredOnly?: boolean }) {
  const { locale, featuredOnly = false } = options;
  const response = getSampleTeamResponse({ featuredOnly });
  return normalizePayloadTeamMembers(response.docs, locale);
}
