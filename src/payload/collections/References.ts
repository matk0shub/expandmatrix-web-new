import type { CollectionConfig } from 'payload'

const REQUIRED_LOCALES = ['en', 'cs'] as const

const validateLocalizedField = (fieldLabel: string) => (value: unknown) => {
  if (!value) {
    return `${fieldLabel} musí mít překlady EN i CS`
  }

  if (typeof value === 'string') {
    return `${fieldLabel} musí mít překlady EN i CS`
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const missing = REQUIRED_LOCALES.filter((locale) => {
      const localized = record[locale]
      return typeof localized !== 'string' || localized.trim().length === 0
    })

    return missing.length > 0
      ? `${fieldLabel}: doplň ${missing.join(' a ')} překlad`
      : true
  }

  return `${fieldLabel} musí mít překlady EN i CS`
}

export const References: CollectionConfig = {
  slug: 'references',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subtitle', 'order'],
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
          validate: validateLocalizedField('Label'),
          admin: {
            description: 'Metric label (e.g., "Orders", "Leads", "Revenue")',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          localized: true,
          validate: validateLocalizedField('Value'),
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
  ],
}
