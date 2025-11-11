import { setTimeout as delay } from 'node:timers/promises'

const toPositiveInteger = (value) => {
  if (!value) return null
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

const resolveDefaultPort = () => {
  const candidates = [
    process.env.PAYLOAD_HEALTH_PORT,
    process.env.PORT,
    process.env.APP_PORT,
    process.env.NEXT_PORT,
    process.env.DEV_PORT,
    process.env.npm_config_port,
  ]

  for (const candidate of candidates) {
    const parsed = toPositiveInteger(candidate)
    if (parsed) {
      return parsed
    }
  }

  return 3000
}

const tryParseUrl = (value) => {
  if (!value || typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null

  const sanitized = trimmed.replace(/^\/+/, '')
  const attempts = [trimmed]
  if (!/^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)) {
    attempts.push(`http://${sanitized}`)
    attempts.push(`https://${sanitized}`)
  }

  for (const attempt of attempts) {
    try {
      return new URL(attempt)
    } catch {
      // try next
    }
  }

  return null
}

const ensureLeadingSlash = (value) => {
  if (!value) return '/'
  return value.startsWith('/') ? value : `/${value}`
}

const resolveBaseUrl = () => {
  const candidates = [
    process.env.PAYLOAD_HEALTH_BASE_URL,
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
    process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL,
    process.env.PAYLOAD_SERVER_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.URL,
    process.env.DEPLOY_URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_PREVIEW_URL,
    process.env.NETLIFY_DEV_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ]

  for (const candidate of candidates) {
    const url = tryParseUrl(candidate)
    if (url) {
      return url.origin
    }
  }

  return null
}

const defaultBaseUrl = `http://127.0.0.1:${resolveDefaultPort()}`
const resolvedHealthPath = ensureLeadingSlash(process.env.PAYLOAD_HEALTH_PATH ?? '/api/payload/health')

const resolveHealthUrl = () => {
  const explicit = tryParseUrl(process.env.PAYLOAD_HEALTH_URL)
  if (explicit) {
    return explicit.toString()
  }

  const baseUrl = resolveBaseUrl() ?? defaultBaseUrl
  try {
    return new URL(resolvedHealthPath, baseUrl).toString()
  } catch {
    return `${baseUrl}${resolvedHealthPath}`
  }
}

const HEALTH_URL = resolveHealthUrl()

const REQUEST_TIMEOUT_MS = Number(process.env.PAYLOAD_HEALTH_TIMEOUT_MS ?? 10_000)

const createAbortController = (timeoutMs) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  return { controller, timeout }
}

async function runHealthCheck(url) {
  const { controller, timeout } = createAbortController(Math.max(1_000, REQUEST_TIMEOUT_MS))
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    const status = response.status
    let payload = null
    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    if (!response.ok) {
      throw new Error(
        `Health check failed with status ${status}${payload?.message ? `: ${payload.message}` : ''}`,
      )
    }

    return { status, payload }
  } finally {
    clearTimeout(timeout)
  }
}

async function waitForHealth(url, attempts = 5) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      return await runHealthCheck(url)
    } catch (error) {
      if (index === attempts - 1) {
        throw error
      }
      await delay(1_000)
    }
  }

  throw new Error('Health check attempts exhausted without response.')
}

try {
  const { status, payload } = await waitForHealth(HEALTH_URL)
  console.log(
    `Payload health check passed (${status})${payload?.latencyMs ? ` latency=${payload.latencyMs}ms` : ''}`,
  )
  if (payload) {
    console.log(JSON.stringify(payload, null, 2))
  }
} catch (error) {
  console.error('Payload health check failed:', error instanceof Error ? error.message : error)
  process.exitCode = 1
}
