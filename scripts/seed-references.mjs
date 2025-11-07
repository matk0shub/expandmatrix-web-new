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
    translationKey: 'techStartup',
    slug: 'tech-startup',
    name: {
      en: 'TechStartup',
      cs: 'TechStartup',
    },
    instagramUrl: 'https://instagram.com/techstartup',
    websiteUrl: 'https://techstartup.ai',
    image: {
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'tech-startup.jpg',
      alt: {
        en: 'Tech startup office',
        cs: 'Tech startup office',
      },
    },
    order: 1,
    isFeatured: true,
    placeholderColor: '#38bdf8',
  },
  {
    translationKey: 'fashionBrand',
    slug: 'fashion-brand',
    name: {
      en: 'FashionBrand',
      cs: 'FashionBrand',
    },
    instagramUrl: 'https://instagram.com/fashionbrand',
    websiteUrl: 'https://fashionbrand.studio',
    image: {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'fashion-brand.jpg',
      alt: {
        en: 'Fashion brand store',
        cs: 'Fashion brand store',
      },
    },
    order: 2,
    isFeatured: true,
    placeholderColor: '#f472b6',
  },
  {
    translationKey: 'restaurantChain',
    slug: 'restaurant-chain',
    name: {
      en: 'RestaurantChain',
      cs: 'RestaurantChain',
    },
    instagramUrl: 'https://instagram.com/restaurantchain',
    websiteUrl: 'https://restaurantchain.digital',
    image: {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'restaurant-chain.jpg',
      alt: {
        en: 'Restaurant interior',
        cs: 'Restaurant interior',
      },
    },
    order: 3,
    isFeatured: true,
    placeholderColor: '#f97316',
  },
  {
    translationKey: 'healthTech',
    slug: 'health-tech',
    name: {
      en: 'HealthTech',
      cs: 'HealthTech',
    },
    instagramUrl: 'https://instagram.com/healthtech',
    websiteUrl: 'https://healthtech.care',
    image: {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'health-tech.jpg',
      alt: {
        en: 'Healthcare technology',
        cs: 'Healthcare technology',
      },
    },
    order: 4,
    isFeatured: true,
    placeholderColor: '#34d399',
  },
  {
    translationKey: 'eduPlatform',
    slug: 'edu-platform',
    name: {
      en: 'EduPlatform',
      cs: 'EduPlatform',
    },
    instagramUrl: 'https://instagram.com/eduplatform',
    websiteUrl: 'https://eduplatform.academy',
    image: {
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'edu-platform.jpg',
      alt: {
        en: 'Online education',
        cs: 'Online education',
      },
    },
    order: 5,
    isFeatured: true,
    placeholderColor: '#a855f7',
  },
  {
    translationKey: 'finTech',
    slug: 'fin-tech',
    name: {
      en: 'FinTech',
      cs: 'FinTech',
    },
    instagramUrl: 'https://instagram.com/fintech',
    websiteUrl: 'https://fintech.global',
    image: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&h=640&q=75',
      filename: 'fin-tech.jpg',
      alt: {
        en: 'Financial technology',
        cs: 'Financial technology',
      },
    },
    order: 6,
    isFeatured: true,
    placeholderColor: '#22d3ee',
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

const normalizeMetricsForLocale = (metrics, ids = []) =>
  metrics.map((metric, index) => {
    const payloadMetric = {
      label: metric.label,
      value: metric.value,
    }

    const existingId = ids[index]
    if (existingId) {
      payloadMetric.id = existingId
    }

    return payloadMetric
  })

const extractMetricIds = (metrics) =>
  Array.isArray(metrics)
    ? metrics.map((metric) => metric?.id ?? metric?._id ?? null)
    : []

async function upsertReference(reference) {
  const { translationKey, slug, name, instagramUrl, websiteUrl, order, isFeatured } = reference

  const enSample = resolveSample(enMessages, translationKey)
  const csSample = resolveSample(csMessages, translationKey)

  const enMetrics = resolveMetrics(enSample.metrics)
  const csMetrics = resolveMetrics(csSample.metrics)

  const imageId = await ensureMediaAsset(reference)

  const baseData = {
    slug,
    instagramUrl,
    websiteUrl,
    order,
    isFeatured,
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

  let targetId
  let metricIds = []

  if (existing.totalDocs > 0) {
    const existingDoc = existing.docs[0]
    targetId = existingDoc.id ?? existingDoc._id
    metricIds = extractMetricIds(existingDoc.metrics)

    const englishPayload = {
      ...baseData,
      name: name.en,
      subtitle: enSample.subtitle ?? '',
      metrics: normalizeMetricsForLocale(enMetrics, metricIds),
    }

    await payload.update({
      collection: 'references',
      id: targetId,
      data: englishPayload,
      locale: 'en',
    })
  } else {
    const englishPayload = {
      ...baseData,
      name: name.en,
      subtitle: enSample.subtitle ?? '',
      metrics: normalizeMetricsForLocale(enMetrics),
    }

    const created = await payload.create({
      collection: 'references',
      data: englishPayload,
      locale: 'en',
    })

    targetId = created.id ?? created._id
    metricIds = extractMetricIds(created.metrics)
  }

  const localizedMetrics = normalizeMetricsForLocale(
    csMetrics.map((metric, index) => ({
      label: metric.label || enMetrics[index]?.label || '',
      value: metric.value || enMetrics[index]?.value || '',
    })),
    metricIds,
  )

  await payload.update({
    collection: 'references',
    id: targetId,
    data: {
      ...baseData,
      name: name.cs ?? name.en,
      subtitle: csSample.subtitle ?? enSample.subtitle ?? '',
      metrics: localizedMetrics,
    },
    locale: 'cs',
  })

  return {
    id: targetId,
    slug,
    action: existing.totalDocs > 0 ? 'updated' : 'created',
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
