import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import { Users } from './src/payload/collections/Users'
import { Team } from './src/payload/collections/Team'
import { References } from './src/payload/collections/References'
import { FAQ } from './src/payload/collections/FAQ'
import { Media } from './src/payload/collections/Media'
import { FooterLinks } from './src/payload/collections/FooterLinks'
import { Subscribers } from './src/payload/collections/Subscribers'
import { SiteSettings } from './src/payload/globals/SiteSettings'

const initPayloadConfig = async () => {
  const [{ lexicalEditor }, { default: sharp }, { default: nodemailer }] = await Promise.all([
    import('@payloadcms/richtext-lexical'),
    import('sharp'),
    import('nodemailer'),
  ])

  const defaultFromAddress =
    process.env.SMTP_FROM ??
    (process.env.SMTP_USER ? `${process.env.SMTP_USER}` : 'info@expandmatrix.com')
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

  return buildConfig({
    secret: process.env.PAYLOAD_SECRET!,
    admin: {
      user: 'users',
    },
    editor: lexicalEditor({}),
    sharp,
    collections: [Users, Team, References, FAQ, Media, FooterLinks, Subscribers],
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
                `SMTP credentials missing, email not sent. Subject: ${
                  subject ?? '(no subject)'
                }`,
              )
              return Promise.resolve()
            },
          },
    plugins: [],
    db: mongooseAdapter({
      url: process.env.DATABASE_URI!,
    }),
  })
}

export default initPayloadConfig()
