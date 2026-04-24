import { getPayloadBaseUrlFromEnv, getSelfHosts } from './payloadServerUrl';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const INTERNAL_PREFIXES = ['/media/', '/api/media/file/', '/images/', '/partners/', '/fonts/'];

const stripOriginIfInternal = (value: string): string => {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (!INTERNAL_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
      return value;
    }

    if (LOCAL_HOSTS.has(host)) {
      return url.pathname + url.search;
    }

    const selfHosts = getSelfHosts();
    if (selfHosts.includes(host)) {
      return url.pathname + url.search;
    }

    return value;
  } catch {
    return value;
  }
};

const getPayloadServerUrl = (): string => {
  const configured = getPayloadBaseUrlFromEnv();
  if (configured) {
    return configured;
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
    return stripOriginIfInternal(trimmed);
  }

  if (trimmed.startsWith('//')) {
    return `${inferProtocol()}${trimmed}`;
  }

  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  // Local static assets (anything under /images/, /partners/, /fonts/) live inside
  // next/public and are served from the current origin — never prepend the Payload
  // base URL, otherwise they break when the app runs on a different port/host.
  const isLocalStatic = ['/images/', '/partners/', '/fonts/'].some((prefix) =>
    normalizedPath.startsWith(prefix),
  );
  if (isLocalStatic) {
    return normalizedPath;
  }

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
