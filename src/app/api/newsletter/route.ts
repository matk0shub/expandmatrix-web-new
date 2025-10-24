import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/payload/getPayloadClient';

export async function POST(req: NextRequest) {
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

    return NextResponse.json({ ok: true, id: result.id });
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

