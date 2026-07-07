import type { CollectionConfig } from 'payload'

import { revalidateSiteContent } from '../revalidateSiteContent'

export const FAQ: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'questionTitle',
    defaultColumns: ['question.cs', 'order', 'showOnSite', 'isFeatured'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data
        }

        const czech = data.question?.cs
        const english = data.question?.en

        if (czech) {
          data.questionTitle = czech
        } else if (english) {
          data.questionTitle = english
        }

        return data
      },
    ],
    afterRead: [
      ({ doc }) => {
        if (!doc) {
          return doc
        }

        if (!doc.questionTitle) {
          doc.questionTitle = doc.question?.cs ?? doc.question?.en ?? doc.questionTitle
        }

        return doc
      },
    ],
    afterChange: [() => revalidateSiteContent()],
    afterDelete: [() => revalidateSiteContent()],
  },
  fields: [
    {
      name: 'questionTitle',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
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
      name: 'showOnSite',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show on website',
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
