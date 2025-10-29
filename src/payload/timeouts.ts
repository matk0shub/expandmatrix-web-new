const clampTimeout = (value: number, fallback: number, min = 500, max = 15_000): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback
  }

  return Math.min(Math.max(value, min), max)
}

export const resolvePayloadInitTimeout = (): number => {
  const parsed = Number(process.env.PAYLOAD_INIT_TIMEOUT_MS ?? '')
  return clampTimeout(parsed, 2_500)
}

export const resolvePayloadQueryTimeout = (): number => {
  const parsed = Number(process.env.PAYLOAD_QUERY_TIMEOUT_MS ?? '')
  return clampTimeout(parsed, 2_000)
}

export const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  createError: () => Error,
): Promise<T> => {
  if (timeoutMs <= 0) {
    return promise
  }

  let timeoutId: NodeJS.Timeout | undefined

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(createError())
        }, timeoutMs)
      }),
    ])
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}
