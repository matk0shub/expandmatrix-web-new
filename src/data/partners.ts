import type { NormalizedPartner, PartnerDocument } from '@/types/partners';
import { resolveMediaUrl } from '@/utils/resolveMediaUrl';

const normalizePayloadPartner = (doc: PartnerDocument): NormalizedPartner | null => {
  const logoObject = typeof doc.logo === 'object' && doc.logo !== null ? doc.logo : undefined;
  const logoSource =
    typeof doc.logo === 'string'
      ? doc.logo
      : logoObject?.url ?? logoObject?.filename ?? null;

  const logoUrl = resolveMediaUrl(logoSource ?? undefined);
  if (!logoUrl) {
    return null;
  }

  const mediaAlt =
    typeof logoObject === 'object' && logoObject !== null && 'alt' in logoObject
      ? (logoObject.alt as string | null | undefined)
      : undefined;
  const resolvedAlt = typeof mediaAlt === 'string' && mediaAlt.trim().length > 0 ? mediaAlt : doc.name;

  return {
    id: doc.id,
    name: doc.name,
    logo: {
      url: logoUrl,
      alt: resolvedAlt,
    },
    scale: typeof doc.scale === 'number' ? doc.scale : undefined,
    showOnSite: doc.showOnSite ?? true,
  };
};

export function normalizePayloadPartners(
  docs: PartnerDocument[],
): NormalizedPartner[] {
  return docs
    .map(normalizePayloadPartner)
    .filter((partner): partner is NormalizedPartner => Boolean(partner?.showOnSite))
    .sort((a, b) => a.name.localeCompare(b.name));
}
