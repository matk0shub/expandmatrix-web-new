import net from 'node:net'
import payload from 'payload'
import path from 'path'
import { pathToFileURL } from 'url'

import { resolveDatabaseUri, resolvePayloadSecret } from '@/payload/env'
import { resolvePayloadInitTimeout, withTimeout } from '@/payload/timeouts'

type PayloadConfigShape = Record<string, unknown>

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

const isFallbackDatabase = (): boolean => process.env.PAYLOAD_USING_FALLBACK_DB === 'true'

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

  if (!isFallbackDatabase()) {
    return false
  }

  return !(await canReachLocalMongo(uri))
}

const initializePayload = async (secret: string) => {
  const config = await loadConfig()
  const timeoutMs = resolvePayloadInitTimeout()

  await withTimeout(
    payload.init({
      config: config as never,
      local: process.env.NODE_ENV !== 'production',
      secret,
    } as never),
    timeoutMs,
    () => createOfflineError(`Payload initialization timed out after ${timeoutMs}ms`)
  )
}

export const getPayloadClient = async () => {
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
    console.debug?.('[payload] Marked offline because fallback database unreachable')
    throw createOfflineError()
  }

  if (!payload.db) {
    if (!payloadInitPromise) {
      console.debug?.('[payload] Initializing Payload CMS client...')
      payloadInitPromise = initializePayload(secret).catch((error: unknown) => {
        const err = error as NodeJS.ErrnoException | undefined

        if (err?.code === PAYLOAD_OFFLINE_CODE) {
          payloadOffline = true

          if (!loggedOfflineWarning) {
            console.warn(
              `[payload] Initialization failed: ${err.message ?? 'Payload CMS offline'}. ` +
                'Sample content will be used instead.'
            )
            loggedOfflineWarning = true
          }
        }

        throw error
      })
    }

    try {
      await payloadInitPromise
      console.debug?.('[payload] Payload initialization finished')
    } finally {
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
