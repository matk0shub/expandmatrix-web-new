import partnersJson from './partners.json';

import type { NormalizedPartner, PartnerDocument } from '@/types/partners';
import { resolveMediaUrl } from '@/utils/resolveMediaUrl';

type SamplePartner = {
  name: string;
  logo: string;
  logoAlt?: string;
  scale?: number;
  order?: number;
  showOnSite?: boolean;
};

const samplePartners = partnersJson as SamplePartner[];

const normalizePayloadPartner = (doc: PartnerDocument): NormalizedPartner | null => {
  const logoSource =
    typeof doc.logo === 'string'
      ? doc.logo
      : doc.logo?.url ?? doc.logo?.filename ?? null;

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

export function getSamplePartners(): NormalizedPartner[] {
  return samplePartners
    .filter((partner) => partner.showOnSite ?? true)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((partner, index) => ({
      id: `sample-partner-${index}`,
      name: partner.name,
      logo: {
        url: partner.logo,
        alt: partner.logoAlt ?? partner.name,
      },
      scale: partner.scale,
      order: partner.order ?? index,
      showOnSite: partner.showOnSite ?? true,
    }));
}

