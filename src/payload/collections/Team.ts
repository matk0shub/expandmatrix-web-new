import type { CollectionConfig } from 'payload'

import { revalidateSiteContent } from '../revalidateSiteContent'

export const Team: CollectionConfig = {
  slug: 'teamMembers',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'roleDisplay', 'order', 'featured'],
  },
  hooks: {
    afterChange: [() => revalidateSiteContent('team-members')],
    afterDelete: [() => revalidateSiteContent('team-members')],
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
            const name = data?.name;
            if (name && typeof name === 'object') {
              return name.cs || name.en || 'Unknown';
            }
            return (name as string) || 'Unknown';
          },
        ],
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
            const role = data?.role;
            if (role && typeof role === 'object') {
              return role.cs || role.en || 'Unknown';
            }
            return (role as string) || 'Unknown';
          },
        ],
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
      name: 'avatarPath',
      label: 'Avatar path',
      type: 'text',
      required: true,
      admin: {
        description: 'Cesta k obrázku ve složce public (např. /images/team/matej.webp)',
      },
      validate: (value: unknown) =>
        typeof value === 'string' && value.trim().startsWith('/')
          ? true
          : 'Zadej cestu ve tvaru /images/team/jmeno.webp',
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
