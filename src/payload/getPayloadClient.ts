import payload from 'payload'
import path from 'path'
import { pathToFileURL } from 'url'

type PayloadConfigShape = Record<string, unknown>

let cachedConfig: PayloadConfigShape | null = null

const loadConfig = async (): Promise<PayloadConfigShape> => {
  if (!cachedConfig) {
    const configPath = path.resolve(process.cwd(), 'payload.config.js')
    const mod = await import(/* webpackIgnore: true */ pathToFileURL(configPath).href)
    const resolvedConfig = await Promise.resolve(mod.default ?? mod)
    cachedConfig = resolvedConfig as PayloadConfigShape
  }

  return cachedConfig
}

export const getPayloadClient = async () => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is required to initialize Payload.')
  }

  if (!payload.db) {
    const config = await loadConfig()

    await payload.init({
      config: config as never,
      local: process.env.NODE_ENV !== 'production',
    } as never)
  }

  return payload
}

export type PayloadClient = Awaited<ReturnType<typeof getPayloadClient>>
