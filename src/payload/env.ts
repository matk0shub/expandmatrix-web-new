const DEV_PAYLOAD_SECRET = 'expandmatrix-development-secret';
const DEV_DATABASE_URI = 'mongodb://127.0.0.1:27017/expandmatrix-dev';

let secretWarned = false;
let databaseWarned = false;

const isProduction = () => process.env.NODE_ENV === 'production';
const isNextBuildPhase = () =>
  process.env.NEXT_PHASE === 'phase-production-build' || process.env.npm_lifecycle_event === 'build';

export const resolvePayloadSecret = (): string => {
  const existingSecret = process.env.PAYLOAD_SECRET;

  if (existingSecret && existingSecret.trim().length > 0) {
    return existingSecret;
  }

  if (isProduction() && !isNextBuildPhase()) {
    throw new Error('PAYLOAD_SECRET environment variable is required in production.');
  }

  if (!secretWarned) {
    console.warn(
      '[payload] PAYLOAD_SECRET is not set. Falling back to a local development secret. Do not use this fallback in production.'
    );
    secretWarned = true;
  }

  process.env.PAYLOAD_SECRET = DEV_PAYLOAD_SECRET;
  return DEV_PAYLOAD_SECRET;
};

export const resolveDatabaseUri = (): string => {
  const existingUri = process.env.DATABASE_URI;

  if (existingUri && existingUri.trim().length > 0) {
    return existingUri;
  }

  if (isProduction() && !isNextBuildPhase()) {
    throw new Error('DATABASE_URI environment variable is required in production.');
  }

  if (!databaseWarned) {
    console.warn(
      '[payload] DATABASE_URI is not set. Using a local MongoDB fallback URI (mongodb://127.0.0.1:27017/expandmatrix-dev).' +
        ' Start a MongoDB instance locally to persist data.'
    );
    databaseWarned = true;
  }

  process.env.DATABASE_URI = DEV_DATABASE_URI;
  return DEV_DATABASE_URI;
};
