import type { CollectionConfig } from 'payload'

export const FAQ: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question.cs',
    defaultColumns: ['question.cs', 'order', 'isFeatured'],
  },
  fields: [
    {
      name: 'question',
      type: 'group',
      fields: [
        {
          name: 'cs',
          type: 'text',
          required: true,
        },
        {
          name: 'en',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'answer',
      type: 'group',
      fields: [
        {
          name: 'cs',
          type: 'textarea',
          required: true,
        },
        {
          name: 'en',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}