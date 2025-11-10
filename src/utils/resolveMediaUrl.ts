import { getPayloadBaseUrlFromEnv } from './payloadServerUrl';

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
