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

export const resolvePayloadSecret = (): string => requireEnv('PAYLOAD_SECRET');

export const resolveDatabaseUri = (): string => requireEnv('DATABASE_URI');
