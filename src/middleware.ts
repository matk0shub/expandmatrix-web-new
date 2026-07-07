import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { serverLog } from '@/utils/serverLog';

const locales = ['en', 'cs'] as const;
const defaultLocale = 'en';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
});

const getLocaleFromPath = (pathname: string) =>
  locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const currentLocale = getLocaleFromPath(pathname);
  const normalizedPathname = currentLocale
    ? pathname.slice((`/${currentLocale}`).length) || '/'
    : pathname;
  const canonicalAdminPath = '/admin';
  const isAdminRoute = normalizedPathname === '/admin' || normalizedPathname.startsWith('/admin/');

  if (isAdminRoute) {
    // Canonicalize locale-prefixed admin path to bare /admin
    if (currentLocale && pathname !== normalizedPathname) {
      const url = request.nextUrl.clone();
      url.pathname = canonicalAdminPath;
      return NextResponse.redirect(url);
    }

    // Canonicalize trailing slashes (/admin/ -> /admin)
    if (normalizedPathname !== canonicalAdminPath && normalizedPathname.replace(/\/+$/, '') === canonicalAdminPath) {
      const url = request.nextUrl.clone();
      url.pathname = canonicalAdminPath;
      return NextResponse.redirect(url);
    }
    serverLog('[middleware] bypass intl for admin route', pathname)
    return NextResponse.next();
  }

  if (!currentLocale) {
    // Unconditional redirect to the default locale - deliberately NOT personalized
    // by the NEXT_LOCALE cookie. A cookie-dependent redirect here would be cached
    // by the browser (Cache-Control, not just Netlify's edge) keyed only on the
    // URL, so a returning cs-cookied visitor could keep getting a stale /en
    // redirect from their own HTTP cache after switching locale. Real in-site
    // navigation always carries a /en or /cs prefix and goes through
    // intlMiddleware below, which is unaffected and handles locale correctly;
    // this branch only covers the bare, locale-less entry point (typically `/`).
    const suffix = pathname || '/';
    const normalizedSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`;

    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${normalizedSuffix === '/' ? '' : normalizedSuffix}`;
    serverLog('[middleware] redirecting to default locale', { from: pathname, to: url.pathname });
    const response = NextResponse.redirect(url, 308);
    response.headers.set('Cache-Control', 'public, max-age=3600');
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|admin|admin/.*|.*\\..*).*)',
    '/',
    '/(en|cs)/:path*',
  ],
};
