import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { getPayloadBaseUrl } from '@/utils/payloadServerUrl';

export const runtime = 'nodejs';

const MEDIA_ROOT = path.join(process.cwd(), 'media');

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

type ParamsPromise = Promise<{ path?: string[] }>;

const resolvePayloadBase = (requestOrigin?: string): URL | null => {
  const base = getPayloadBaseUrl();
  if (!base) return null;

  try {
    const parsed = new URL(base);
    if (requestOrigin && parsed.origin === requestOrigin) {
      return null;
    }
    return parsed;
  } catch {
    console.error('[media] Invalid payload base URL:', base);
    return null;
  }
};

const resolveFilePath = (segments: string[]): string | null => {
  if (!segments.length) return null;

  const unsafePath = path.join(MEDIA_ROOT, ...segments);
  const normalized = path.normalize(unsafePath);

  if (!normalized.startsWith(MEDIA_ROOT)) {
    console.warn('[media] Attempted directory traversal:', segments.join('/'));
    return null;
  }

  return normalized;
};

const loadLocalMedia = async (segments: string[]): Promise<NextResponse | null> => {
  const filePath = resolveFilePath(segments);
  if (!filePath) return null;

  try {
    const file = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT') {
      console.error(`[media] Failed to read local file ${segments.join('/')}:`, error);
    }
    return null;
  }
};

const proxyFromPayload = async (
  segments: string[],
  requestOrigin?: string,
): Promise<NextResponse | null> => {
  const base = resolvePayloadBase(requestOrigin);
  if (!base) return null;

  const pathname = ['/media', ...segments].join('/');
  const target = new URL(pathname, base);

  try {
    const upstream = await fetch(target, { cache: 'no-store' });
    if (!upstream.ok || !upstream.body) {
      if (upstream.status !== 404) {
        console.error(`[media] Upstream error ${upstream.status} for ${target.href}`);
      }
      return null;
    }

    const headers = new Headers(upstream.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/octet-stream');
    }
    if (!headers.has('Cache-Control')) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable, stale-while-revalidate=86400');
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    console.error(`[media] Failed to proxy ${target.href}:`, error);
    return null;
  }
};

const resolveSegments = async (paramsPromise: ParamsPromise): Promise<string[]> => {
  const { path = [] } = await paramsPromise;
  return Array.isArray(path) ? path : [];
};

const handleRequest = async (
  segments: string[],
  requestOrigin?: string,
): Promise<NextResponse | null> => {
  const local = await loadLocalMedia(segments);
  if (local) return local;

  return proxyFromPayload(segments, requestOrigin);
};

const missingPathResponse = () =>
  NextResponse.json({ error: 'Missing file path' }, { status: 400 });

const notFoundResponse = () =>
  NextResponse.json({ error: 'Media not found' }, { status: 404 });

export async function GET(
  request: NextRequest,
  context: { params: ParamsPromise },
) {
  const segments = await resolveSegments(context.params);
  if (!segments.length) return missingPathResponse();

  const response = await handleRequest(segments, request.nextUrl?.origin);
  return response ?? notFoundResponse();
}

export async function HEAD(
  request: NextRequest,
  context: { params: ParamsPromise },
) {
  const segments = await resolveSegments(context.params);
  if (!segments.length) return missingPathResponse();

  const response = await handleRequest(segments, request.nextUrl?.origin);
  if (!response) return notFoundResponse();

  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}
