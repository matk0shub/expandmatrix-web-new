import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const loadEnv = () => {
  const candidates = ['.env.local', '.env']
  for (const candidate of candidates) {
    const envPath = path.join(projectRoot, candidate)
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath })
      break
    }
  }
}

loadEnv()

if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URI) {
  console.error(
    'Missing PAYLOAD_SECRET or DATABASE_URI. Ensure environment variables are set before running the site settings seed script.',
  )
  process.exit(1)
}

const { default: payload } = await import('payload')
const configModule = await import(path.join(projectRoot, 'payload.config.js'))
const config = await configModule.default

await payload.init({
  config,
  local: true,
})

const SITE_SETTINGS_DATA = {
  social: {
    instagram: 'https://www.instagram.com/expandmatrix',
    linkedin: 'https://www.linkedin.com/company/expandmatrix',
    twitter: 'https://x.com/expandmatrix',
  },
}

try {
  await payload.updateGlobal({
    slug: 'siteSettings',
    data: SITE_SETTINGS_DATA,
  })

  console.log('Site settings seed complete: siteSettings global updated.')
} catch (error) {
  console.error('Failed to seed site settings:', error)
  process.exitCode = 1
} finally {
  const client =
    payload?.db?.connection?.getClient?.() ??
    payload?.db?.client ??
    payload?.db?.connection?.client ??
    null
  await client?.close?.()
}
