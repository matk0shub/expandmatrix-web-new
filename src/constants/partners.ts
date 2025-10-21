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
      kind: 'logoStacked';
      /** Top logo asset, ideally an icon-only SVG */
      src: string;
      /** Accessible name for screen readers */
      alt: string;
      /** Optional scale multiplier applied to the icon */
      scale?: number;
      /** One or two lines rendered below the logo */
      labelLines: [string, string?];
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
    scale: 0.7
  },
  {
    kind: 'logoStacked',
    src: '/images/partners/klimatizace_tomes.svg',
    alt: 'Klimatizace Tomeš',
    scale: 0.7,
    labelLines: ['Klimatizace', 'Tomeš']
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
