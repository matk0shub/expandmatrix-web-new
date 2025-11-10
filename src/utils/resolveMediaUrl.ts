const candidateEnvUrls = [
  process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL,
  process.env.PAYLOAD_PUBLIC_SERVER_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.SITE_URL,
  process.env.URL,
  process.env.DEPLOY_URL,
  process.env.DEPLOY_PRIME_URL,
  process.env.DEPLOY_PREVIEW_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
];

const normalizeBaseUrl = (value?: string | null): string | null => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/+/, '')}`;

  try {
    const url = new URL(withProtocol);
    return url.origin;
  } catch {
    return null;
  }
};

let cachedServerBaseUrl: string | null | undefined;

const getConfiguredPayloadBaseUrl = (): string => {
  if (cachedServerBaseUrl !== undefined) {
    return cachedServerBaseUrl ?? '';
  }

  for (const candidate of candidateEnvUrls) {
    const normalized = normalizeBaseUrl(candidate);
    if (normalized) {
      cachedServerBaseUrl = normalized;
      return normalized;
    }
  }

  cachedServerBaseUrl = null;
  return '';
};

const getPayloadServerUrl = (): string => {
  const configured = getConfiguredPayloadBaseUrl();
  if (configured) {
    return configured;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return '';
};

const inferProtocol = (): 'http:' | 'https:' => {
  const baseUrl = getPayloadServerUrl();

  if (baseUrl.startsWith('https://')) {
    return 'https:';
  }

  if (baseUrl.startsWith('http://')) {
    return 'http:';
  }

  if (typeof window !== 'undefined' && window.location?.protocol) {
    return window.location.protocol === 'https:' ? 'https:' : 'http:';
  }

  return 'https:';
};

/**
 * Normalizes media URLs coming from Payload CMS to ensure they are safe to use with next/image.
 * Handles absolute URLs, protocol-relative URLs, and relative paths (with or without leading slash).
 */
export const resolveMediaUrl = (input?: string | null): string => {
  if (!input) {
    return '';
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `${inferProtocol()}${trimmed}`;
  }

  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  const baseUrl = getPayloadServerUrl();

  if (baseUrl) {
    try {
      return new URL(normalizedPath, baseUrl).toString();
    } catch (error) {
      console.warn(
        '[media] Failed to resolve media URL using PAYLOAD_PUBLIC_SERVER_URL:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  return normalizedPath;
};

export default resolveMediaUrl;
