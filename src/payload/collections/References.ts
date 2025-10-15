import type { CollectionConfig } from 'payload'

export const References: CollectionConfig = {
  slug: 'references',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subtitle', 'order', 'isFeatured'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the name (e.g., "tech-startup")',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      admin: {
        description: 'Short description (e.g., "Tenisky / Streetwear Store")',
      },
    },
    {
      name: 'instagramUrl',
      type: 'text',
      admin: {
        description: 'Instagram profile URL (optional)',
      },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      admin: {
        description: 'Official website URL (optional)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Background image for the reference',
      },
    },
    {
      name: 'metrics',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Metric label (e.g., "Orders", "Leads", "Revenue")',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Metric value (e.g., "887 655 CZK", "9.2 %")',
          },
        },
      ],
      admin: {
        description: 'Key performance metrics to display in the stats card',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Sort order for the references list (lower numbers appear first)',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this reference in the references section',
      },
    },
  ],
}
