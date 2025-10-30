import net from 'node:net'
import payload from 'payload'
import path from 'path'
import { pathToFileURL } from 'url'

import { isUsingFallbackDatabase, resolveDatabaseUri, resolvePayloadSecret } from '@/payload/env'
import { resolvePayloadInitTimeout, withTimeout } from '@/payload/timeouts'

type PayloadConfigShape = Record<string, unknown>

type GlobalWithPayloadInit = typeof globalThis & {
  __payloadInit?: Promise<void> | null
  __payloadOffline?: boolean
}

const PAYLOAD_OFFLINE_CODE = 'PAYLOAD_OFFLINE' as const

let cachedConfig: PayloadConfigShape | null = null
let loggedOfflineWarning = false
let payloadOffline = false
let payloadInitPromise: Promise<void> | null = null

const loadConfig = async (): Promise<PayloadConfigShape> => {
  if (!cachedConfig) {
    const configPath = path.resolve(process.cwd(), 'payload.config.js')
    const mod = await import(/* webpackIgnore: true */ pathToFileURL(configPath).href)
    const resolvedConfig = await Promise.resolve(mod.default ?? mod)
    cachedConfig = resolvedConfig as PayloadConfigShape
  }

  return cachedConfig
}

const createOfflineError = (message?: string): NodeJS.ErrnoException => {
  const offlineError = new Error(message ?? 'Payload CMS offline') as NodeJS.ErrnoException
  offlineError.code = PAYLOAD_OFFLINE_CODE
  return offlineError
}

const canReachLocalMongo = async (uri: string): Promise<boolean> => {
  try {
    const mongoUrl = new URL(uri)
    const host = mongoUrl.hostname || '127.0.0.1'
    const port = Number(mongoUrl.port || 27017)

    return await new Promise((resolve) => {
      const socket = net.createConnection({ host, port })
      let settled = false

      const finish = (result: boolean) => {
        if (settled) return
        settled = true
        socket.removeAllListeners()
        socket.destroy()
        resolve(result)
      }

      socket.once('connect', () => finish(true))
      socket.once('error', () => finish(false))
      socket.setTimeout(750, () => finish(false))
    })
  } catch {
    return true
  }
}

const shouldSkipPayloadInit = async (uri: string): Promise<boolean> => {
  if (process.env.PAYLOAD_FORCE_CONNECT === 'true') {
    return false
  }

  if (!isUsingFallbackDatabase()) {
    return false
  }

  return !(await canReachLocalMongo(uri))
}

const initializePayload = async (secret: string) => {
  const config = await loadConfig()
  const init = payload.init({
    config: config as never,
    local: process.env.NODE_ENV !== 'production',
    secret,
  } as never)

  if (!isUsingFallbackDatabase()) {
    await init
    return
  }

  const timeoutMs = resolvePayloadInitTimeout()

  await withTimeout(
    init,
    timeoutMs,
    () => createOfflineError(`Payload initialization timed out after ${timeoutMs}ms`)
  )
}

export const getPayloadClient = async () => {
  const g = globalThis as GlobalWithPayloadInit

  if (typeof g.__payloadOffline === 'boolean') {
    payloadOffline = g.__payloadOffline
  }

  if (payloadOffline) {
    console.debug?.('[payload] getPayloadClient short-circuited: offline flag set')
    throw createOfflineError()
  }

  const secret = resolvePayloadSecret()
  const databaseUri = resolveDatabaseUri()

  if (await shouldSkipPayloadInit(databaseUri)) {
    if (!loggedOfflineWarning) {
      console.warn(
        '[payload] Skipping Payload CMS initialization because the local MongoDB fallback is unreachable. ' +
          'Sample content will be used instead.'
      )
      loggedOfflineWarning = true
    }

    payloadOffline = true
    g.__payloadOffline = true
    console.debug?.('[payload] Marked offline because fallback database unreachable')
    throw createOfflineError()
  }

  if (!payload.db) {
    if (!payloadInitPromise) {
      // Reuse global init promise across HMR cycles in dev
      payloadInitPromise = (g.__payloadInit ||= initializePayload(secret).catch((error: unknown) => {
        const err = error as NodeJS.ErrnoException | undefined

        if (err?.code === PAYLOAD_OFFLINE_CODE) {
          payloadOffline = true
          g.__payloadOffline = true

          if (!loggedOfflineWarning) {
            console.warn(
              `[payload] Initialization failed: ${err.message ?? 'Payload CMS offline'}. ` +
                'Sample content will be used instead.'
            )
            loggedOfflineWarning = true
          }
        }

        throw error
      }))
    }

    try {
      await payloadInitPromise
      console.debug?.('[payload] Payload initialization finished')
    } finally {
      // Do not null out the global promise; keep it for HMR cycles
      payloadInitPromise = null
    }
  }

  if (payloadOffline || !payload.db) {
    console.debug?.('[payload] Initialization unsuccessful, returning offline error')
    throw createOfflineError()
  }

  console.debug?.('[payload] Returning initialized Payload instance')
  return payload
}

export type PayloadClient = Awaited<ReturnType<typeof getPayloadClient>>
