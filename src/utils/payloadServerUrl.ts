const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

const candidateEnvUrls = [
  process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL,
  process.env.PAYLOAD_PUBLIC_SERVER_URL,
];

const candidateSiteUrls = [
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.SITE_URL,
  process.env.URL,
  process.env.DEPLOY_URL,
  process.env.DEPLOY_PRIME_URL,
  process.env.DEPLOY_PREVIEW_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
];

const isHostedEnv =
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.NETLIFY) ||
  Boolean(process.env.URL) ||
  Boolean(process.env.SITE_URL) ||
  Boolean(process.env.DEPLOY_URL) ||
  Boolean(process.env.DEPLOY_PRIME_URL) ||
  Boolean(process.env.DEPLOY_PREVIEW_URL) ||
  Boolean(process.env.CI && process.env.CI !== 'false' && process.env.CI !== '0');

const allowLocalHostnames = process.env.ALLOW_LOCAL_PAYLOAD_URL === 'true' || !isHostedEnv;

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
    if (!allowLocalHostnames && LOCAL_HOSTNAMES.has(url.hostname.toLowerCase())) {
      return null;
    }
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

  const resolveFromList = (candidates: Array<string | undefined>) => {
    for (const candidate of candidates) {
      const normalized = normalizeBaseUrl(candidate);
      if (normalized) {
        cachedServerBaseUrl = normalized;
        return normalized;
      }
    }
    return null;
  };

  const envResolved = resolveFromList(candidateEnvUrls);
  if (envResolved) {
    return envResolved;
  }

  const siteResolved = resolveFromList(candidateSiteUrls);
  if (siteResolved) {
    return siteResolved;
  }

  cachedServerBaseUrl = null;
  return '';
};

export const getPayloadBaseUrl = (): string => getPayloadBaseUrlFromEnv();

let cachedSelfHosts: string[] | null = null;

export const getSelfHosts = (): string[] => {
  if (cachedSelfHosts) {
    return cachedSelfHosts;
  }

  const hosts = new Set<string>();

  const addHost = (candidate?: string | null) => {
    const normalized = normalizeBaseUrl(candidate);
    if (!normalized) return;
    try {
      const { hostname } = new URL(normalized);
      if (hostname) {
        hosts.add(hostname.toLowerCase());
      }
    } catch {
      // ignore invalid URLs
    }
  };

  for (const candidate of candidateEnvUrls) {
    addHost(candidate);
  }

  for (const candidate of candidateSiteUrls) {
    addHost(candidate);
  }

  cachedSelfHosts = Array.from(hosts);
  return cachedSelfHosts;
};
