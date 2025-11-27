import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const loadEnv = () => {
  const envPath = path.join(projectRoot, '.env')
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
  }
}

loadEnv()

if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URI) {
  console.error('Missing PAYLOAD_SECRET or DATABASE_URI. Aborting prune script.')
  process.exit(1)
}

const allowedSlugs = [
  'tech-startup',
  'ac-klimes',
  'apex-mma-gym',
  'nova-clinic',
  'expando-logistics',
]

const { default: payload } = await import('payload')
const configModule = await import(path.join(projectRoot, 'payload.config.js'))
const config = configModule.default ?? configModule

await payload.init({
  config,
  local: true,
})

try {
  const existing = await payload.find({
    collection: 'references',
    limit: 200,
    locale: 'all',
  })

  const removable = existing.docs.filter((doc) => !allowedSlugs.includes(doc.slug))

  for (const doc of removable) {
    const id = doc.id ?? doc._id
    if (!id) continue

    await payload.delete({
      collection: 'references',
      id,
    })
    console.log(`Deleted reference ${doc.slug} (${id})`)
  }

  console.log(`Prune completed. Removed ${removable.length} references.`)
} catch (error) {
  console.error('Failed to prune references:', error)
  process.exitCode = 1
} finally {
  const client =
    payload?.db?.connection?.getClient?.() ??
    payload?.db?.client ??
    payload?.db?.connection?.client ??
    null
  await client?.close?.()
}
