import type { CollectionConfig } from 'payload'

export const Team: CollectionConfig = {
  slug: 'teamMembers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role.cs', 'order', 'featured'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'role',
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
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'bio',
      type: 'group',
      fields: [
        {
          name: 'cs',
          type: 'textarea',
          required: false,
        },
        {
          name: 'en',
          type: 'textarea',
          required: false,
        },
      ],
    },
  ],
}
