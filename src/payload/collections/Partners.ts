import type { CollectionConfig } from 'payload';

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'showOnSite', 'updatedAt'],
    description:
      'Upload partner logos that appear in the “Our Partners” section. Entries marked as hidden are excluded from the website.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
