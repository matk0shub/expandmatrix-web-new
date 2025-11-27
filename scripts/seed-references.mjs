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

const loadEnv = () => {
  const candidates = ['.env']
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
    'Missing PAYLOAD_SECRET or DATABASE_URI. Ensure environment variables are set before running the references seed script.',
  )
  process.exit(1)
}

const baseReferences = [
  {
    translationKey: 'ubytovaniHornacko',
    slug: 'ubytovani-hornacko',
    name: {
      en: 'Ubytování Horňácko',
      cs: 'Ubytování Horňácko',
    },
    instagramUrl: 'https://instagram.com/ubytovani_hornacko',
    websiteUrl: 'https://ubytovani-hornacko.cz',
    image: {
      url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'ubytovani-hornacko.jpg',
      alt: {
        en: 'Boutique accommodation in Horňácko',
        cs: 'Butikové ubytování na Horňácku',
      },
    },
    order: 1,
    placeholderColor: '#38bdf8',
  },
  {
    translationKey: 'acKlimes',
    slug: 'ac-klimes',
    name: {
      en: 'AC Klimeš',
      cs: 'AC Klimeš',
    },
    instagramUrl: 'https://instagram.com/ac_klimes',
    websiteUrl: 'https://acklimes.cz',
    image: {
      url: 'https://images.unsplash.com/photo-1458891216473-4f26bb4eb40e?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'ac-klimes.jpg',
      alt: {
        en: 'HVAC technicians at work',
        cs: 'Technici HVAC',
      },
    },
    order: 2,
    placeholderColor: '#34d399',
  },
  {
    translationKey: 'apexMma',
    slug: 'apex-mma-gym',
    name: {
      en: 'Apex MMA Gym',
      cs: 'Apex MMA Gym',
    },
    instagramUrl: 'https://www.instagram.com/apexmmagym/',
    websiteUrl: 'https://apexmmagym.com',
    image: {
      url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'apex-mma-gym.jpg',
      alt: {
        en: 'MMA gym training session',
        cs: 'Trénink v MMA gymu',
      },
    },
    order: 3,
    placeholderColor: '#f97316',
  },
  {
    translationKey: 'novaClinic',
    slug: 'nova-clinic',
    name: {
      en: 'Nova Clinic',
      cs: 'Nova Clinic',
    },
    instagramUrl: 'https://instagram.com/novaclinic',
    websiteUrl: 'https://novaclinic.eu',
    image: {
      url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'nova-clinic.jpg',
      alt: {
        en: 'Clinic interior',
        cs: 'Interiér kliniky',
      },
    },
    order: 4,
    placeholderColor: '#fb7185',
  },
  {
    translationKey: 'expandoLogistics',
    slug: 'expando-logistics',
    name: {
      en: 'Expando Logistics',
      cs: 'Expando Logistics',
    },
    instagramUrl: 'https://instagram.com/expandologistics',
    websiteUrl: 'https://expando-logistics.com',
    image: {
      url: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'expando-logistics.jpg',
      alt: {
        en: 'Logistics hub',
        cs: 'Logistický hub',
      },
    },
    order: 5,
    placeholderColor: '#10b981',
  },
]

const loadMessages = (locale) => {
  const filePath = path.join(projectRoot, 'src', 'messages', `${locale}.json`)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

const enMessages = loadMessages('en')
const csMessages = loadMessages('cs')

const resolveSample = (messages, key) =>
  messages?.sections?.references?.samples?.[key] ?? { subtitle: '', metrics: [] }

const resolveMetrics = (metrics = []) =>
  Array.isArray(metrics)
    ? metrics.map((entry) => ({
        label: typeof entry?.label === 'string' ? entry.label : '',
        value: typeof entry?.value === 'string' ? entry.value : '',
      }))
    : []

const { default: payload } = await import('payload')
const configModule = await import(path.join(projectRoot, 'payload.config.js'))
const config = await configModule.default

await payload.init({
  config,
  local: true,
})

const findMediaByFilename = async (filename) => {
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
    const diskFilename = doc.filename ?? filename
    const diskPath = diskFilename ? path.join(mediaDir, diskFilename) : null

    if (diskPath && fs.existsSync(diskPath)) {
      return { id: doc.id ?? doc._id, doc }
    }

    const identifier = doc.id ?? doc._id
    if (identifier) {
      console.warn(
        `[seed:references] Media document "${diskFilename}" missing on disk, deleting and re-uploading.`,
      )
      await payload.delete({
        collection: 'media',
        id: identifier,
      })
    }
  }

  return { id: null, doc: null }
}

let sharpInstance = null
const getSharp = async () => {
  if (!sharpInstance) {
    const sharpModule = await import('sharp')
    sharpInstance = sharpModule.default ?? sharpModule
  }
  return sharpInstance
}

const ensureMediaAsset = async (reference) => {
  const { image } = reference
  if (!image?.url) {
    return null
  }

  const { id: existingId } = await findMediaByFilename(image.filename)
  if (existingId) {
    await payload.update({
      collection: 'media',
      id: existingId,
      data: {
        alt: image.alt?.en ?? '',
      },
    })
    return existingId
  }

  let buffer = null
  let mimetype = 'image/jpeg'

  if (image.url) {
    try {
      const response = await fetch(image.url)
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        buffer = Buffer.from(arrayBuffer)
        mimetype = response.headers.get('content-type') ?? 'image/jpeg'
      } else {
        console.warn(
          `[seed:references] Download failed (${response.status}) for ${image.url}, generating placeholder.`,
        )
      }
    } catch (error) {
      console.warn(
        `[seed:references] Download error for ${image.url}: ${
          error instanceof Error ? error.message : error
        }. Generating placeholder.`,
      )
    }
  }

  if (!buffer) {
    const sharp = await getSharp()
    const width = 1280
    const height = 720
    buffer = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: reference.placeholderColor ?? '#0f172a',
      },
    })
      .jpeg({ quality: 88 })
      .toBuffer()
    mimetype = 'image/jpeg'
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt: image.alt?.en ?? '',
    },
    file: {
      mimetype,
      name: image.filename,
      data: buffer,
      size: buffer.length,
    },
  })

  return created.id ?? created._id
}

const buildDualLocaleMetrics = (enMetrics, csMetrics) =>
  enMetrics.map((metric, index) => {
    const csMetric = csMetrics[index] ?? {}
    return {
      label: {
        en: metric.label,
        cs: csMetric.label || metric.label,
      },
      value: {
        en: metric.value,
        cs: csMetric.value || metric.value,
      },
    }
  })

async function upsertReference(reference) {
  const { translationKey, slug, name, instagramUrl, websiteUrl, order } = reference

  const enSample = resolveSample(enMessages, translationKey)
  const csSample = resolveSample(csMessages, translationKey)

  const enMetrics = resolveMetrics(enSample.metrics)
  const csMetrics = resolveMetrics(csSample.metrics)
  const metrics = buildDualLocaleMetrics(enMetrics, csMetrics)

  const imageId = await ensureMediaAsset(reference)

  const baseData = {
    slug,
    instagramUrl,
    websiteUrl,
    order,
    metrics,
    name: {
      en: name.en,
      cs: name.cs ?? name.en,
    },
    subtitle: {
      en: enSample.subtitle ?? '',
      cs: csSample.subtitle ?? enSample.subtitle ?? '',
    },
    ...(imageId ? { image: imageId } : {}),
  }

  const existing = await payload.find({
    collection: 'references',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    locale: 'all',
  })

  if (existing.totalDocs > 0) {
    const existingDoc = existing.docs[0]
    const targetId = existingDoc.id ?? existingDoc._id

    await payload.update({
      collection: 'references',
      id: targetId,
      data: baseData,
    })

    return {
      id: targetId,
      slug,
      action: 'updated',
    }
  }

  const created = await payload.create({
    collection: 'references',
    data: baseData,
  })

  return {
    id: created.id ?? created._id,
    slug,
    action: 'created',
  }
}

try {
  const results = []
  for (const reference of baseReferences) {
    const result = await upsertReference(reference)
    results.push(result)
  }

  const summary = results.reduce(
    (acc, result) => {
      acc[result.action] += 1
      return acc
    },
    { created: 0, updated: 0 },
  )

  console.log('References seed complete:', summary)
  results.forEach((result) => {
    console.log(`- ${result.action.toUpperCase()}: ${result.slug} (id: ${result.id})`)
  })
} catch (error) {
  console.error('Failed to seed references:', error)
  process.exitCode = 1
} finally {
  const client =
    payload?.db?.connection?.getClient?.() ??
    payload?.db?.client ??
    payload?.db?.connection?.client ??
    null
  await client?.close?.()
}
