import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function resolvePayloadBase(): URL | null {
  const base = process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL
  if (!base) return null
  try {
    return new URL(base)
  } catch {
    return null
  }
}

export async function GET(req: NextRequest, { params }: { params: { path?: string[] } }) {
  const base = resolvePayloadBase()
  if (!base) {
    return NextResponse.json({ error: 'Payload base URL not configured' }, { status: 500 })
  }

  const segments = params.path || []
  if (!Array.isArray(segments) || segments.length === 0) {
    return NextResponse.json({ error: 'Missing file path' }, { status: 400 })
  }

  // Build target URL: /media/<...segments>
  const pathname = ['/media', ...segments].join('/')
  const target = new URL(pathname, base)

  try {
    const upstream = await fetch(target, { cache: 'no-cache' })
    if (!upstream.ok) {
      return NextResponse.json({ error: 'Upstream not found' }, { status: upstream.status })
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    const res = new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable, stale-while-revalidate=86400',
      },
    })
    return res
  } catch (error) {
    return NextResponse.json({ error: 'Proxy error' }, { status: 502 })
  }
}

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

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

const resolveFilePath = (segments: string[]): string | null => {
  if (!segments.length) {
    return null;
  }

  const unsafePath = path.join(MEDIA_ROOT, ...segments);
  const normalized = path.normalize(unsafePath);

  if (!normalized.startsWith(MEDIA_ROOT)) {
    return null;
  }

  return normalized;
};

const serveMedia = async (segments: string[]) => {
  const filePath = resolveFilePath(segments);

  if (!filePath) {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 });
  }

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
  } catch (error) {
    console.error(`[media] Failed to load ${segments.join('/')}:`, error);
    return NextResponse.json({ error: 'Media not found' }, { status: 404 });
  }
};

type ParamsPromise = Promise<{ path?: string[] }>;

export async function GET(
  _request: NextRequest,
  context: { params: ParamsPromise },
) {
  const { path = [] } = await context.params;
  return serveMedia(path);
}

export async function HEAD(
  _request: NextRequest,
  context: { params: ParamsPromise },
) {
  const { path = [] } = await context.params;
  const response = await serveMedia(path);

  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}
