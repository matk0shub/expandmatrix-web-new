import type { CollectionConfig } from 'payload';

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'showOnSite', 'updatedAt'],
    description:
      'Upload partner logos that appear in the “Our Partners” section. Entries marked as hidden are excluded from the website.',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        if (!data.logoAlt && data.name) {
          data.logoAlt = data.name;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logoPath',
      type: 'text',
      required: true,
      admin: {
        description:
          'Cesta k logu verzovanému v repozitáři, např. /images/partners/openai_logo.svg',
      },
      validate: (value: unknown) =>
        typeof value === 'string' && value.trim().length > 0 && value.trim().startsWith('/')
          ? true
          : 'Zadej relativní cestu začínající lomítkem (např. /images/partners/logo.svg)',
    },
    {
      name: 'logoAlt',
      label: 'Logo alt text',
      type: 'text',
      admin: {
        description: 'Defaults to the partner name if left blank.',
      },
    },
    {
      name: 'scale',
      type: 'number',
      admin: {
        description: 'Optional size multiplier applied to the logo inside the orbiting ball.',
        step: 0.05,
      },
      min: 0.3,
      max: 1.4,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showOnSite',
      label: 'Show on website',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
};
