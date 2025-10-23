import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { Users } from './src/payload/collections/Users.ts'
import { Team } from './src/payload/collections/Team.ts'
import { References } from './src/payload/collections/References.ts'
import { FAQ } from './src/payload/collections/FAQ.ts'
import { Media } from './src/payload/collections/Media.ts'
import { FooterLinks } from './src/payload/collections/FooterLinks.ts'
import { Subscribers } from './src/payload/collections/Subscribers.ts'
import { SiteSettings } from './src/payload/globals/SiteSettings.ts'
import sharp from 'sharp'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  admin: {
    user: 'users',
  },
  editor: lexicalEditor({}),
  sharp,
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
