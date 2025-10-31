export function serverLog(...args: unknown[]) {
  if ((process.env.LOG_LEVEL || '').toLowerCase() === 'debug') {
    console.log('[debug]', ...args)
  }
}
