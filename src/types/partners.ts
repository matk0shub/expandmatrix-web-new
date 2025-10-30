import type { Partner as PartnerDocument } from '../../payload-types';

export interface NormalizedPartner {
  id: string;
  name: string;
  logo: {
    url: string;
    alt: string;
  };
  scale?: number;
  order: number;
  showOnSite: boolean;
}

export type { PartnerDocument };
