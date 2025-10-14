import { NextResponse } from 'next/server';
import payload from 'payload';

export async function GET() {
  try {
    if (!payload.db) {
      // @ts-expect-error: init accepts minimal options in this context
      await payload.init({ local: true });
    }
    const settings = await payload.findGlobal({ slug: 'siteSettings' });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ social: {} });
  }
}


