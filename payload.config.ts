import path from 'path'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import nodemailer from 'nodemailer'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { FAQ } from './src/payload/collections/FAQ'
import { FooterLinks } from './src/payload/collections/FooterLinks'
import { Media } from './src/payload/collections/Media'
import { Partners } from './src/payload/collections/Partners'
import { References } from './src/payload/collections/References'
import { Subscribers } from './src/payload/collections/Subscribers'
import { Team } from './src/payload/collections/Team'
import { Users } from './src/payload/collections/Users'
import { SiteSettings } from './src/payload/globals/SiteSettings'
import { isUsingFallbackDatabase, resolveDatabaseUri, resolvePayloadSecret } from './src/payload/env'

const defaultFromAddress =
  process.env.SMTP_FROM ?? (process.env.SMTP_USER ? `${process.env.SMTP_USER}` : 'info@expandmatrix.com')
const defaultFromName = process.env.SMTP_FROM_NAME ?? 'Expand Matrix'
const smtpHost = process.env.SMTP_HOST ?? 'smtp.gmail.com'
const smtpPort = Number(process.env.SMTP_PORT ?? 465)
const smtpSecure = (process.env.SMTP_SECURE ?? 'true') !== 'false'
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS

const transporter =
  smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null

const secret = resolvePayloadSecret()
const databaseUri = resolveDatabaseUri()

const connectOptions = isUsingFallbackDatabase()
  ? {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
      socketTimeoutMS: 1500,
    }
  : undefined

export default buildConfig({
  secret,
  admin: {
    user: 'users',
  },
  editor: lexicalEditor({}),
  sharp,
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Czech',
        code: 'cs',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [Users, Team, Partners, References, FAQ, Media, FooterLinks, Subscribers],
  globals: [SiteSettings],
  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(process.cwd(), 'generated-schema.graphql'),
  },
  email: ({ payload }) =>
    transporter
      ? {
          name: 'gmail-smtp',
          defaultFromAddress,
          defaultFromName,
          sendEmail: async (message) => {
            const { from, ...rest } = message
            return transporter.sendMail({
              ...rest,
              from: from ?? `${defaultFromName} <${defaultFromAddress}>`,
            })
          },
        }
      : {
          name: 'console',
          defaultFromAddress,
          defaultFromName,
          sendEmail: async (message) => {
            const { subject } = message
            payload.logger.warn(
              `SMTP credentials missing, email not sent. Subject: ${subject ?? '(no subject)'}`,
            )
            return Promise.resolve()
          },
        },
  plugins: [],
  db: mongooseAdapter({
    url: databaseUri,
    ...(connectOptions ? { connectOptions } : {}),
  }),
})
