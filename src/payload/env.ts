const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  throw new Error(
    `[payload] Missing required environment variable "${key}". ` +
      'Ensure it is defined in your runtime environment or .env file before starting the app.',
  );
};

const resolveEnvWithFallback = (...keys: string[]): string => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  throw new Error(
    `[payload] Missing required environment variable. Tried keys: ${keys.join(', ')}. ` +
      'Set a remote MongoDB connection string (mongodb+srv://...).',
  );
};

const assertNotLocalMongo = (uri: string): string => {
  const isLocal = /^mongodb(?:\+srv)?:\/\/(localhost|127(?:\.0){2}\.1)(?=[:/]|$)/i.test(uri);
  if (isLocal) {
    throw new Error(
      '[payload] Local MongoDB connection strings are not supported. Provide a remote MongoDB cluster URI.',
    );
  }

  return uri;
};

export const resolvePayloadSecret = (): string => requireEnv('PAYLOAD_SECRET');

export const resolveDatabaseUri = (): string =>
  assertNotLocalMongo(resolveEnvWithFallback('DATABASE_URI', 'MONGODB_URI'));
