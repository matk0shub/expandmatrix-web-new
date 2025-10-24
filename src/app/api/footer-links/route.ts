import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/payload/getPayloadClient';

export async function GET() {
  try {
    const payload = await getPayloadClient();

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

