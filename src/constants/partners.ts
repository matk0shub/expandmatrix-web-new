export type PartnerContent =
  | {
      kind: 'logo';
      /** Path to the logo asset placed under public/images/partners */
      src: string;
      /** Accessible name for screen readers */
      alt: string;
      /** Optional scale multiplier to fine tune logo sizing inside the glass ball */
      scale?: number;
    }
  | {
      kind: 'label';
      /** Short placeholder label shown until the slot is filled with a logo */
      text: string;
    };

export const partnerItems: PartnerContent[] = [
  {
    kind: 'logo',
    src: '/images/partners/bodybody_logo.svg',
    alt: 'BodyBody',
    scale: 0.68
  },
  {
    kind: 'logo',
    src: '/images/partners/klimatizace_tomes.svg',
    alt: 'Klimatizace Tomeš',
    scale: 0.72
  },
  {
    kind: 'label',
    text: 'COMING'
  },
  {
    kind: 'label',
    text: 'SOON'
  },
  {
    kind: 'label',
    text: 'IN TALKS'
  },
  {
    kind: 'label',
    text: 'TBA'
  },
  {
    kind: 'label',
    text: 'NEXT'
  },
  {
    kind: 'label',
    text: 'FUTURE'
  },
  {
    kind: 'label',
    text: 'RESERVED'
  },
  {
    kind: 'label',
    text: 'UP NEXT'
  },
  {
    kind: 'label',
    text: 'ONBOARD'
  },
  {
    kind: 'label',
    text: 'TBC'
  }
];
