import payload from 'payload'

import { resolvePayloadSecret } from '@/payload/env'
import payloadConfig from '@/payload/config'
import { serverLog } from '@/utils/serverLog'

type PayloadConfigShape = Record<string, unknown>

type GlobalWithPayloadInit = typeof globalThis & {
  __payloadInit?: Promise<void> | null
}

let payloadInitPromise: Promise<void> | null = null

const initializePayload = async () => {
  serverLog('[payload] initializePayload: start')
  const secret = resolvePayloadSecret()

  const init = payload.init({
    config: payloadConfig as PayloadConfigShape as never,
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
