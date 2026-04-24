import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/revalidate?secret=<REVALIDATION_SECRET>[&slug=<slug>]
 *
 * Called by Strapi webhooks on article publish / unpublish / update / delete.
 * Clears the Next.js ISR cache for all blog pages so Netlify serves fresh content.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid or missing secret' }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get('slug');

  // Always revalidate blog list pages for both locales
  revalidatePath('/en/blog', 'page');
  revalidatePath('/cs/blog', 'page');

  // Revalidate specific post if slug is provided
  if (slug) {
    revalidatePath(`/en/blog/${slug}`, 'page');
    revalidatePath(`/cs/blog/${slug}`, 'page');
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

// Also allow GET for quick testing from browser
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid or missing secret' }, { status: 401 });
  }

  revalidatePath('/en/blog', 'page');
  revalidatePath('/cs/blog', 'page');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
