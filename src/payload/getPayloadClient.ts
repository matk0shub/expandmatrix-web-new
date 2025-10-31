import payload from 'payload'
import path from 'path'
import { pathToFileURL } from 'url'

import { resolvePayloadSecret } from '@/payload/env'

type PayloadConfigShape = Record<string, unknown>

type GlobalWithPayloadInit = typeof globalThis & {
  __payloadInit?: Promise<void> | null
}

let cachedConfig: PayloadConfigShape | null = null
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

const initializePayload = async () => {
  const config = await loadConfig()
  const secret = resolvePayloadSecret()

  const init = payload.init({
    config: config as never,
    local: process.env.NODE_ENV !== 'production',
    secret,
  } as never)
  await init
}

export const getPayloadClient = async () => {
  const g = globalThis as GlobalWithPayloadInit

  if (!payload.db) {
    if (!payloadInitPromise) {
      payloadInitPromise = (g.__payloadInit ||= initializePayload().finally(() => {
        g.__payloadInit = null
      }))
    }

    try {
      await payloadInitPromise
      console.debug?.('[payload] Payload initialization finished')
      if (payload.db) {
        return payload
      }
    } finally {
      payloadInitPromise = null
    }
  }

  if (!payload.db) {
    throw new Error('[payload] Initialization unsuccessful. Verify MongoDB connectivity and configuration.')
  }

  return payload
}

export type PayloadClient = Awaited<ReturnType<typeof getPayloadClient>>
