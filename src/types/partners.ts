import type { Partner as PartnerBase } from '../../payload-types';

export type PartnerDocument = PartnerBase & {
  logoPath?: string;
};

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
