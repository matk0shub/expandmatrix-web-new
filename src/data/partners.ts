import type { NormalizedPartner, PartnerDocument } from '@/types/partners';
import { resolveMediaUrl } from '@/utils/resolveMediaUrl';

const normalizePayloadPartner = (doc: PartnerDocument): NormalizedPartner | null => {
  const rawLogoPath = (doc as { logoPath?: unknown }).logoPath;
  const configuredPath = typeof rawLogoPath === 'string' ? rawLogoPath.trim() : '';

  const payloadLogo =
    typeof doc.logo === 'object' && doc.logo !== null ? doc.logo : undefined;

  const logoSource =
    configuredPath ||
    (typeof doc.logo === 'string'
      ? doc.logo
      : payloadLogo?.url ?? payloadLogo?.filename ?? null);

  const logoUrl = resolveMediaUrl(logoSource ?? undefined);
  if (!logoUrl) {
    return null;
  }

  return {
    id: doc.id,
    name: doc.name,
    logo: {
      url: logoUrl,
      alt: doc.logoAlt ?? doc.name,
    },
    scale: typeof doc.scale === 'number' ? doc.scale : undefined,
    order: typeof doc.order === 'number' ? doc.order : 0,
    showOnSite: doc.showOnSite ?? true,
  };
};

export function normalizePayloadPartners(
  docs: PartnerDocument[],
): NormalizedPartner[] {
  return docs
    .map(normalizePayloadPartner)
    .filter((partner): partner is NormalizedPartner => Boolean(partner?.showOnSite))
    .sort((a, b) => a.order - b.order);
}
