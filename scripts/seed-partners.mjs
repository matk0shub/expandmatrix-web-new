import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const mediaDir = path.join(projectRoot, 'media')

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true })
}

const envCandidates = ['.env.local', '.env']
for (const candidate of envCandidates) {
  const envPath = path.join(projectRoot, candidate)
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
    break
  }
}

if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URI) {
  console.error('Missing PAYLOAD_SECRET or DATABASE_URI. Set environment variables before running the partners seed script.')
  process.exit(1)
}

const partners = [
  {
    name: 'n8n',
    logo: {
      url: 'https://images.ctfassets.net/28eu8h0h0k27/5VNyQEBFDvka2JCQnuhVxZ/ac45fb1a5d73ff5102b31b9a8d5d74d9/n8n-logo.png',
      filename: 'partner-n8n.png',
      alt: 'n8n automation logo',
    },
    scale: 1,
    order: 1,
  },
  {
    name: 'OpenAI',
    logo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
      filename: 'partner-openai.svg',
      alt: 'OpenAI logo',
    },
    scale: 0.9,
    order: 2,
  },
  {
    name: 'Cal.com',
    logo: {
      url: 'https://assets.cal.com/brand/cal-logo-dark.svg',
      filename: 'partner-cal.svg',
      alt: 'Cal.com scheduling logo',
    },
    scale: 1,
    order: 3,
  },
  {
    name: 'Cursor',
    logo: {
      url: 'https://avatars.githubusercontent.com/u/12201221?s=200&v=4',
      filename: 'partner-cursor.png',
      alt: 'Cursor AI pair programming logo',
    },
    scale: 0.75,
    order: 4,
  },
  {
    name: 'BodyBody',
    logo: {
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&h=300&q=80',
      filename: 'partner-bodybody.jpg',
      alt: 'BodyBody wellness brand artwork',
    },
    scale: 1,
    order: 5,
  },
  {
    name: 'Pruzinárna',
    logo: {
      url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=300&h=300&q=80',
      filename: 'partner-pruzinarna.jpg',
      alt: 'Manufacturing abstract illustration',
    },
    scale: 1,
    order: 6,
  },
]

let sharpInstance = null
const getSharp = async () => {
  if (!sharpInstance) {
    const sharpModule = await import('sharp')
    sharpInstance = sharpModule.default ?? sharpModule
  }
  return sharpInstance
}

const ensureMedia = async (payload, { url, filename, alt }) => {
  const existing = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: filename,
      },
    },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    const doc = existing.docs[0]
    if (doc.alt !== alt) {
      await payload.update({ collection: 'media', id: doc.id, data: { alt } })
    }
    return doc.id
  }

  let buffer = null
  let mimetype = 'image/png'

  if (url) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        buffer = Buffer.from(arrayBuffer)
        mimetype = response.headers.get('content-type') ?? mimetype
      } else {
        console.warn(`[seed:partners] Download failed (${response.status}) for ${url}. Generating placeholder.`)
      }
    } catch (error) {
      console.warn(`[seed:partners] Download error for ${url}: ${error instanceof Error ? error.message : error}. Generating placeholder.`)
    }
  }

  if (!buffer) {
    const sharp = await getSharp()
    buffer = await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 3,
        background: '#0f172a',
      },
    })
      .png()
      .toBuffer()
    mimetype = 'image/png'
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt,
    },
    file: {
      name: filename,
      data: buffer,
      size: buffer.length,
      mimetype,
    },
  })

  return created.id ?? created._id
}

const upsertPartner = async (payload, partner) => {
  const mediaId = await ensureMedia(payload, partner.logo)
  const baseData = {
    name: partner.name,
    logo: mediaId,
    logoAlt: partner.logo.alt ?? partner.name,
    scale: partner.scale,
    order: partner.order,
    showOnSite: true,
  }

  const existing = await payload.find({
    collection: 'partners',
    where: {
      name: {
        equals: partner.name,
      },
    },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    const doc = existing.docs[0]
    await payload.update({ collection: 'partners', id: doc.id, data: baseData })
    return { action: 'updated', name: partner.name, id: doc.id }
  }

  const created = await payload.create({ collection: 'partners', data: baseData })
  return { action: 'created', name: partner.name, id: created.id ?? created._id }
}

const run = async () => {
  const { default: payload } = await import('payload')
  const configModule = await import(path.join(projectRoot, 'payload.config.js'))
  const config = configModule.default

  await payload.init({ config, local: true, secret: process.env.PAYLOAD_SECRET })

  const results = []
  for (const partner of partners) {
    const result = await upsertPartner(payload, partner)
    results.push(result)
  }

  const summary = results.reduce((acc, entry) => {
    acc[entry.action] = (acc[entry.action] ?? 0) + 1
    return acc
  }, {})

  console.log('Partners seed complete:', summary)
  for (const entry of results) {
    console.log(`- ${entry.action.toUpperCase()}: ${entry.name} (${entry.id})`)
  }

  await payload.db.connection?.getClient?.()?.close?.()
}

run().catch((error) => {
  console.error('Failed to seed partners:', error)
  process.exitCode = 1
})
