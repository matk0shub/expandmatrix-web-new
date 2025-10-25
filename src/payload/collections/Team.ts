import type { CollectionConfig } from 'payload'

export const Team: CollectionConfig = {
  slug: 'teamMembers',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'roleDisplay', 'order', 'featured'],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated display name for admin interface',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data.name && typeof data.name === 'object') {
              return data.name.cs || data.name.en || 'Unknown';
            }
            return data.name || 'Unknown';
          }
        ]
      }
    },
    {
      name: 'roleDisplay',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated role display for admin interface',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data.role && typeof data.role === 'object') {
              return data.role.cs || data.role.en || 'Unknown';
            }
            return data.role || 'Unknown';
          }
        ]
      }
    },
    {
      name: 'name',
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
    {
      name: 'focus',
      label: 'Focus areas',
      type: 'array',
      admin: {
        description: 'Displayed as expertise badges on the website.',
      },
      fields: [
        {
          name: 'value',
          label: 'Focus item',
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
      ],
    },
    {
      name: 'accent',
      label: 'Accent gradient',
      type: 'text',
      admin: {
        description: 'CSS color or gradient used for card glow (e.g. linear-gradient(...)).',
        position: 'sidebar',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'socials',
      label: 'Social links',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'twitter',
          type: 'text',
        },
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'youtube',
          type: 'text',
        },
        {
          name: 'website',
          type: 'text',
        },
      ],
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
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
}
