import type { NormalizedTeamMember, TeamMemberDocument } from '@/types/team';
import { resolveMediaUrl } from '@/utils/resolveMediaUrl';

function localizedValue(
  value: string | Record<string, string | undefined> | undefined,
  locale: string,
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value.cs ?? value.en ?? '';
}

function isLocalizedRecord(
  value: unknown,
): value is Record<string, string | undefined> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.values(value).some(
    (entry) => typeof entry === 'string' || typeof entry === 'undefined',
  );
}

function normalizeFocus(doc: TeamMemberDocument, locale: string): string[] {
  if (!doc.focus || !Array.isArray(doc.focus)) {
    return [];
  }

  return doc.focus
    .map((item) => {
      if (typeof item === 'string') {
        // Old format: direct string
        return item;
      } else if (item && typeof item === 'object') {
        if (item.value && typeof item.value === 'object') {
          // New format: { value: { cs, en } }
          return localizedValue(item.value, locale);
        } else if (typeof item.value === 'string') {
          // Mixed format: { value: string }
          return item.value;
        } else if (isLocalizedRecord(item)) {
          // Fallback: try to get text from item itself
          return localizedValue(item, locale);
        } else {
          return '';
        }
      }
      return '';
    })
    .filter((item): item is string => Boolean(item));
}

export function normalizePayloadTeamMembers(
  docs: TeamMemberDocument[],
  locale: string,
): NormalizedTeamMember[] {
  return docs
    .map((doc) => {
      const configuredAvatarPath =
        typeof (doc as { avatarPath?: unknown }).avatarPath === 'string'
          ? ((doc as { avatarPath?: string }).avatarPath ?? '').trim()
          : '';

      const avatarFromPath = configuredAvatarPath
        ? {
            url: resolveMediaUrl(configuredAvatarPath),
            alt: localizedValue(doc.name, locale),
          }
        : undefined;

      const avatarLegacy =
        typeof doc.avatar === 'string'
          ? {
              url: resolveMediaUrl(doc.avatar),
              alt: localizedValue(doc.name, locale),
            }
          : doc.avatar?.url
            ? {
                url: resolveMediaUrl(doc.avatar.url),
                alt: doc.avatar.alt ?? localizedValue(doc.name, locale),
              }
            : undefined;

      const avatar = avatarFromPath?.url ? avatarFromPath : avatarLegacy;

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
