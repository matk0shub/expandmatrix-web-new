import jitiFactory from 'jiti'
import payload from 'payload'
import path from 'path'
import { pathToFileURL } from 'url'

import { resolvePayloadSecret } from '@/payload/env'
import { serverLog } from '@/utils/serverLog'

type PayloadConfigShape = Record<string, unknown>

type GlobalWithPayloadInit = typeof globalThis & {
  __payloadInit?: Promise<void> | null
}

let cachedConfig: PayloadConfigShape | null = null
let payloadInitPromise: Promise<void> | null = null

const loadConfig = async (): Promise<PayloadConfigShape> => {
  if (!cachedConfig) {
    const loader = jitiFactory(process.cwd())
    try {
      const mod = loader(path.resolve(process.cwd(), 'payload.config.ts'))
      cachedConfig = (mod.default ?? mod) as PayloadConfigShape
      return cachedConfig
    } catch (error) {
      serverLog(
        `[payload] Failed to load payload.config.ts via jiti: ${
          error instanceof Error ? error.message : String(error)
        }. Falling back to payload.config.js.`,
      )
    }

    const configPath = path.resolve(process.cwd(), 'payload.config.js')
    const mod = await import(/* webpackIgnore: true */ pathToFileURL(configPath).href)
    const resolvedConfig = await Promise.resolve(mod.default ?? mod)
    cachedConfig = resolvedConfig as PayloadConfigShape
  }

  return cachedConfig
}

const initializePayload = async () => {
  serverLog('[payload] initializePayload: start')
  const config = await loadConfig()
  const secret = resolvePayloadSecret()

  const init = payload.init({
    config: config as never,
    local: true,
    secret,
  } as never)
  await init
  serverLog('[payload] initializePayload: finished')
}

export const getPayloadClient = async () => {
  const g = globalThis as GlobalWithPayloadInit

  if (!payload.db) {
    serverLog('[payload] getPayloadClient: payload.db missing, initializing...')
    if (!payloadInitPromise) {
      payloadInitPromise = (g.__payloadInit ||= initializePayload().finally(() => {
        g.__payloadInit = null
      }))
    }

    try {
      await payloadInitPromise
      console.debug?.('[payload] Payload initialization finished')
      if (payload.db) {
        serverLog('[payload] getPayloadClient: payload.db present after init')
        return payload
      }
    } finally {
      payloadInitPromise = null
    }
  }

  if (!payload.db) {
    throw new Error('[payload] Initialization unsuccessful. Verify MongoDB connectivity and configuration.')
  }

  serverLog('[payload] getPayloadClient: returning existing payload instance')
  return payload
}

export type PayloadClient = Awaited<ReturnType<typeof getPayloadClient>>
