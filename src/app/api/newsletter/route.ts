import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export async function POST(req: NextRequest) {
  try {
    const { email, locale, consent } = await req.json();
    if (!email || !consent || !locale) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Ensure Payload is initialized (only in server runtime)
    if (!payload.db) {
      // Minimal init for local usage in Next route
      // Payload config is already in project root
      // @ts-expect-error: init accepts minimal options in this context
      await payload.init({ local: true });
    }

    const result = await payload.create({
      collection: 'subscribers',
      data: { email, locale, consent },
    });

    return NextResponse.json({ ok: true, id: result.id });
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}


