import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/payload/getPayloadClient';
import { rateLimit, getClientIp } from '@/utils/rateLimit';

const MAX_REQUESTS_PER_WINDOW = 10;
const WINDOW_MS = 60_000; // 1 minute

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`newsletter:${ip}`, MAX_REQUESTS_PER_WINDOW, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((limit.resetAt - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(limit.resetAt / 1000).toString(),
        },
      },
    );
  }

  try {
    const { email, locale, consent } = await req.json();
    if (!email || !consent || !locale) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const payload = await getPayloadClient();

    const result = await payload.create({
      collection: 'subscribers',
      data: { email, locale, consent },
    });

    return NextResponse.json(
      { ok: true, id: result.id },
      {
        headers: {
          'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
          'X-RateLimit-Remaining': String(limit.remaining),
          'X-RateLimit-Reset': Math.ceil(limit.resetAt / 1000).toString(),
        },
      },
    );
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
