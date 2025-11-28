import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const publicDir = path.join(projectRoot, 'public')

const envPath = path.join(projectRoot, '.env')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URI) {
  console.error('Missing PAYLOAD_SECRET or DATABASE_URI. Aborting partners seed.')
  process.exit(1)
}

const partnerEntries = [
  { name: 'Anthropic', logoPath: '/images/partners/anthropic.svg', alt: 'Anthropic', scale: 0.78, order: 1 },
  { name: 'Augment', logoPath: '/images/partners/augment.svg', alt: 'Augment AI', scale: 0.82, order: 2 },
  { name: 'Claude', logoPath: '/images/partners/claude.svg', alt: 'Claude AI', scale: 0.82, order: 3 },
  { name: 'Copilot', logoPath: '/images/partners/copilot.svg', alt: 'GitHub Copilot', scale: 0.74, order: 4 },
  { name: 'Cursor', logoPath: '/images/partners/cursor.svg', alt: 'Cursor', scale: 0.76, order: 5 },
  { name: 'Gemini', logoPath: '/images/partners/gemini.svg', alt: 'Google Gemini', scale: 0.8, order: 6 },
  { name: 'Grok', logoPath: '/images/partners/grok.svg', alt: 'xAI Grok', scale: 0.8, order: 7 },
  { name: 'Kimi', logoPath: '/images/partners/kimi.svg', alt: 'Kimi AI', scale: 0.82, order: 8 },
  { name: 'Kling', logoPath: '/images/partners/kling-color.svg', alt: 'Kling AI', scale: 0.86, order: 9 },
  { name: 'MiniMax', logoPath: '/images/partners/minimax.svg', alt: 'MiniMax', scale: 0.8, order: 10 },
  { name: 'n8n', logoPath: '/images/partners/n8n_logo.svg', alt: 'n8n Automation', scale: 0.75, order: 11 },
  { name: 'Ollama', logoPath: '/images/partners/ollama.svg', alt: 'Ollama', scale: 0.8, order: 12 },
  { name: 'OpenAI', logoPath: '/images/partners/openai_logo.svg', alt: 'OpenAI', scale: 0.72, order: 13 },
  { name: 'Sora', logoPath: '/images/partners/sora.svg', alt: 'OpenAI Sora', scale: 0.8, order: 14 },
]

const { default: payload } = await import('payload')
const configModule = await import(path.join(projectRoot, 'payload.config.js'))
const config = configModule.default ?? configModule

await payload.init({
  config,
  local: true,
})

const ensureAssetExists = (relativePath) => {
  const normalized = relativePath.replace(/^\/+/, '')
  const absolute = path.join(publicDir, normalized)
  if (!fs.existsSync(absolute)) {
    throw new Error(`Missing partner logo asset: ${relativePath}`)
  }
}

const upsertPartner = async (entry) => {
  ensureAssetExists(entry.logoPath)

  const existing = await payload.find({
    collection: 'partners',
    where: {
      name: {
        equals: entry.name,
      },
    },
    limit: 1,
  })

  const data = {
    name: entry.name,
    logoPath: entry.logoPath,
    logoAlt: entry.alt,
    scale: entry.scale,
    order: entry.order,
    showOnSite: true,
  }

  if (existing.totalDocs > 0) {
    await payload.update({
      collection: 'partners',
      id: existing.docs[0].id,
      data,
    })
    return { action: 'updated', id: existing.docs[0].id }
  }

  const created = await payload.create({
    collection: 'partners',
    data,
  })

  return { action: 'created', id: created.id ?? created._id }
}

const allowedNames = new Set(partnerEntries.map((entry) => entry.name.toLowerCase()))

try {
  const summary = { created: 0, updated: 0, removed: 0 }
  for (const entry of partnerEntries) {
    const result = await upsertPartner(entry)
    summary[result.action] += 1
    console.log(`${result.action.toUpperCase()}: ${entry.name}`)
  }

  const existingPartners = await payload.find({
    collection: 'partners',
    limit: 200,
  })

  for (const partner of existingPartners.docs) {
    const id = partner.id ?? partner._id
    const name = String(partner.name ?? '').toLowerCase()
    if (id && name && !allowedNames.has(name)) {
      await payload.delete({ collection: 'partners', id })
      summary.removed += 1
      console.log(`REMOVED: ${partner.name}`)
    }
  }

  console.log('Partners seed finished', summary)
} catch (error) {
  console.error('Failed to seed partners:', error)
  process.exitCode = 1
} finally {
  const client =
    payload?.db?.connection?.getClient?.() ??
    payload?.db?.client ??
    payload?.db?.connection?.client ??
    null
  await client?.close?.()
}
