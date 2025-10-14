import type { CollectionConfig } from 'payload'

export const FooterLinks: CollectionConfig = {
  slug: 'footerLinks',
  labels: {
    singular: 'Footer Link Group',
    plural: 'Footer Link Groups',
  },
  admin: {
    useAsTitle: 'groupTitle',
    defaultColumns: ['groupTitle', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'groupTitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'links',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
        {
          name: 'external',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}

export default FooterLinks


