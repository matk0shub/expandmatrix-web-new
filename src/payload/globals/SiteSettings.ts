import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'twitter', type: 'text' },
      ],
    },
  ],
}

export default SiteSettings


