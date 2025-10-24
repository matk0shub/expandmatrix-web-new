import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/payload/getPayloadClient';

export async function GET() {
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({ slug: 'siteSettings' });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ social: {} });
  }
}

