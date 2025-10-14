import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { Users } from './src/payload/collections/Users'
import { Team } from './src/payload/collections/Team'
import { References } from './src/payload/collections/References'
import { FAQ } from './src/payload/collections/FAQ'
import { Media } from './src/payload/collections/Media'
import { FooterLinks } from './src/payload/collections/FooterLinks'
import { Subscribers } from './src/payload/collections/Subscribers'
import { SiteSettings } from './src/payload/globals/SiteSettings'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  admin: {
    user: 'users',
  },
  editor: lexicalEditor({}),
  collections: [Users, Team, References, FAQ, Media, FooterLinks, Subscribers],
  globals: [SiteSettings],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),
})
