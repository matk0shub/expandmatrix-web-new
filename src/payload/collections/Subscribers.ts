import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: {
    singular: 'Subscriber',
    plural: 'Subscribers',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'locale', 'consent', 'createdAt'],
  },
  access: {
    read: () => false,
    // We'll create via API route; admin manages in CMS
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'locale',
      type: 'text',
      required: true,
    },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    // TODO: add verificationToken for double opt-in
  ],
  timestamps: true,
}

export default Subscribers


