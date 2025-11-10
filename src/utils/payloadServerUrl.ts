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

export const getPayloadBaseUrlFromEnv = (): string => {
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

export const getPayloadBaseUrl = (): string => getPayloadBaseUrlFromEnv();
