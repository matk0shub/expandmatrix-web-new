export function serverLog(...args: unknown[]) {
  if ((process.env.LOG_LEVEL || '').toLowerCase() === 'debug') {
    // eslint-disable-next-line no-console
    console.log('[debug]', ...args)
  }
}

