import { setTimeout as delay } from 'node:timers/promises'

const HEALTH_URL =
  process.env.PAYLOAD_HEALTH_URL && process.env.PAYLOAD_HEALTH_URL.length > 0
    ? process.env.PAYLOAD_HEALTH_URL
    : 'http://127.0.0.1:3000/api/payload/health'

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
