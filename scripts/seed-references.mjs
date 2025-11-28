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
  console.error(
    'Missing PAYLOAD_SECRET or DATABASE_URI. Ensure environment variables are set before running the references seed script.',
  )
  process.exit(1)
}

const normalizePath = (value) => (value?.startsWith('/') ? value : `/${value ?? ''}`)

const ensureAssetExists = (relativePath) => {
  const normalized = normalizePath(relativePath).replace(/^\/+/, '')
  const absolute = path.join(publicDir, normalized)

  if (!fs.existsSync(absolute)) {
    throw new Error(`Missing reference asset: /${normalized}`)
  }

  return `/${normalized}`
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
    imagePath: '/images/reference/ubytovani_hornacko.webp',
    imageAlt: 'Boutique accommodation in Horňácko',
    order: 1,
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
    imagePath: '/images/reference/ac_tomes.webp',
    imageAlt: 'HVAC technicians at work',
    order: 2,
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
    imagePath: '/images/reference/apex_gym.webp',
    imageAlt: 'MMA gym training session',
    order: 3,
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
    imagePath: '/images/reference/nova_clinic.webp',
    imageAlt: 'Clinic interior',
    order: 4,
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
    imagePath: '/images/reference/expando_logistics.webp',
    imageAlt: 'Logistics warehouse',
    order: 5,
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

const { default: payload } = await import('payload')
const configModule = await import(path.join(projectRoot, 'payload.config.js'))
const config = await configModule.default

await payload.init({
  config,
  local: true,
})

async function upsertReference(reference) {
  const { translationKey, slug, name, instagramUrl, websiteUrl, order, imagePath, imageAlt } = reference

  const resolvedPath = ensureAssetExists(imagePath)

  const enSample = resolveSample(enMessages, translationKey)
  const csSample = resolveSample(csMessages, translationKey)

  const metrics = buildDualLocaleMetrics(resolveMetrics(enSample.metrics), resolveMetrics(csSample.metrics))

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
    imagePath: resolvedPath,
    imageAlt,
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
    const id = existing.docs[0].id ?? existing.docs[0]._id
    await payload.update({
      collection: 'references',
      id,
      data: baseData,
    })
    return { action: 'updated', id }
  }

  const created = await payload.create({
    collection: 'references',
    data: baseData,
  })

  return { action: 'created', id: created.id ?? created._id }
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
  results.forEach((result, index) => {
    console.log(`- ${result.action.toUpperCase()}: ${baseReferences[index].slug} (id: ${result.id})`)
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
