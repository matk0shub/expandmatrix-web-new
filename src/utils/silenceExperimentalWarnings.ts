declare global {
  var __silencedSQLiteWarning: boolean | undefined
}

if (!global.__silencedSQLiteWarning) {
  process.on('warning', (warning) => {
    if (warning?.name === 'ExperimentalWarning' && /SQLite/i.test(warning?.message ?? '')) {
      return
    }

    console.warn(warning)
  })

  global.__silencedSQLiteWarning = true
}

export {}
