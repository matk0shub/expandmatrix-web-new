import { NextResponse } from 'next/server';
import payload from 'payload';

export async function GET() {
  try {
    if (!payload.db) {
      // @ts-expect-error: init accepts minimal options in this context
      await payload.init({ local: true });
    }

    const docs = await payload.find({
      collection: 'footerLinks',
      sort: 'order',
      limit: 100,
    });

    return NextResponse.json({ groups: docs.docs });
  } catch {
    return NextResponse.json({ groups: [] });
  }
}


