import partnersJson from './partners.json';

import type { NormalizedPartner, PartnerDocument } from '@/types/partners';
import { resolveMediaUrl } from '@/utils/resolveMediaUrl';

type SamplePartner = {
  name: string;
  logo: string;
  alt?: string;
  scale?: number;
  showOnSite?: boolean;
};

const samplePartners = partnersJson as SamplePartner[];

const normalizePayloadPartner = (doc: PartnerDocument): NormalizedPartner | null => {
  if (doc.showOnSite === false) {
    return null;
  }

  const logoData = typeof doc.logo === 'object' && doc.logo ? doc.logo : null;
  const logoSource =
    typeof doc.logo === 'string'
      ? doc.logo
      : logoData?.url ?? logoData?.filename ?? null;

  const logoUrl = resolveMediaUrl(logoSource ?? undefined);
  if (!logoUrl) {
    return null;
  }

  const altText =
    (logoData && typeof logoData === 'object' && 'alt' in logoData
      ? (logoData.alt as string | null | undefined)
      : undefined) ?? doc.name;

  return {
    id: doc.id,
    name: doc.name,
    logo: {
      url: logoUrl,
      alt: altText,
    },
    scale: typeof doc.scale === 'number' ? doc.scale : undefined,
  };
};

export function normalizePayloadPartners(
  docs: PartnerDocument[],
): NormalizedPartner[] {
  return docs
    .map(normalizePayloadPartner)
    .filter((partner): partner is NormalizedPartner => Boolean(partner));
}

export function getSamplePartners(): NormalizedPartner[] {
  return samplePartners
    .filter((partner) => partner.showOnSite ?? true)
    .map((partner, index) => ({
      id: `sample-partner-${index}`,
      name: partner.name,
      logo: {
        url: partner.logo,
        alt: partner.alt ?? partner.name,
      },
      scale: partner.scale,
    }));
}
