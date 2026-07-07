import type { CollectionConfig } from 'payload'

import { revalidateSiteContent } from '../revalidateSiteContent'

const REQUIRED_LOCALES = ['en', 'cs'] as const

const validateLocalizedField = (fieldLabel: string) => (value: unknown) => {
  if (!value || typeof value !== 'object') {
    return `${fieldLabel} musí mít překlady EN i CS`
  }

  const record = value as Record<string, unknown>
  const missing = REQUIRED_LOCALES.filter((locale) => {
    const localized = record[locale]
    return typeof localized !== 'string' || localized.trim().length === 0
  })

  return missing.length > 0
    ? `${fieldLabel}: doplň ${missing.join(' a ')} překlad`
    : true
}

const dualLocaleTextField = ({
  name,
  label,
  description,
  required = false,
}: {
  name: string
  label: string
  description?: string
  required?: boolean
}) =>
({
  name,
  type: 'group',
  validate: validateLocalizedField(label),
  admin: {
    description,
  },
  fields: REQUIRED_LOCALES.map((locale) => ({
    name: locale,
    label: `${label} (${locale.toUpperCase()})`,
    type: 'text',
    required,
  })),
}) as CollectionConfig['fields'][number]

export const References: CollectionConfig = {
  slug: 'references',
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'order'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data
        }

        if (!data.imageAlt) {
          const name = data.name
          const derived =
            (typeof name === 'object' && (name.cs || name.en)) ||
            (typeof name === 'string' ? name : null)
          if (derived) {
            data.imageAlt = derived
          }
        }

        return data
      },
    ],
    afterChange: [() => revalidateSiteContent('references')],
    afterDelete: [() => revalidateSiteContent('references')],
  },
  fields: [
    dualLocaleTextField({
      name: 'name',
      label: 'Project title',
      description: 'Název reference v EN i CS',
      required: true,
    }),
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the name (e.g., "tech-startup")',
      },
    },
    dualLocaleTextField({
      name: 'subtitle',
      label: 'Subtitle',
      description: 'Krátký popis (např. "AI implementace ve fintech")',
    }),
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
      name: 'imagePath',
      label: 'Image path',
      type: 'text',
      required: true,
      admin: {
        description: 'Cesta k obrázku verzovanému v repozitáři (např. /images/reference/nova_clinic.webp)',
      },
      validate: (value: unknown) =>
        typeof value === 'string' && value.trim().startsWith('/')
          ? true
          : 'Použij cestu ve tvaru /images/reference/example.webp',
    },
    {
      name: 'imageAlt',
      label: 'Image alt text',
      type: 'text',
      admin: {
        description: 'Volitelné – pokud necháš prázdné, doplní se automaticky z názvu reference.',
      },
    },
    {
      name: 'metrics',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'group',
          validate: validateLocalizedField('Label'),
          fields: [
            {
              name: 'en',
              label: 'Label (EN)',
              type: 'text',
              required: true,
            },
            {
              name: 'cs',
              label: 'Label (CS)',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Metric label (e.g., "Orders", "Leads", "Revenue")',
          },
        },
        {
          name: 'value',
          type: 'group',
          validate: validateLocalizedField('Value'),
          fields: [
            {
              name: 'en',
              label: 'Value (EN)',
              type: 'text',
              required: true,
            },
            {
              name: 'cs',
              label: 'Value (CS)',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Metric value (e.g., "887 655 CZK", "9.2 %")',
          },
        },
      ],
      admin: {
        description: 'Key performance metrics to display in the stats card (vyplň EN i CS na jednom místě)',
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
