import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { serverLog } from '@/utils/serverLog';

const locales = ['en', 'cs'] as const;
const defaultLocale = 'en';
const localeCookieName = 'NEXT_LOCALE';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

const getLocaleFromPath = (pathname: string) =>
  locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

const getPreferredLocale = (request: NextRequest): (typeof locales)[number] => {
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale as (typeof locales)[number];
  }

  const accept = request.headers.get('accept-language');
  if (accept) {
    const preferred = accept
      .split(',')
      .map((part) => part.trim().split(';')[0])
      .find((lng) => locales.includes(lng.split('-')[0] as (typeof locales)[number]));
    if (preferred) {
      return preferred.split('-')[0] as (typeof locales)[number];
    }
  }

  return defaultLocale;
};

export default function middleware(request: NextRequest) {
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const hasCookieLocale = cookieLocale && locales.includes(cookieLocale as (typeof locales)[number]);
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
    const target = hasCookieLocale ? (cookieLocale as (typeof locales)[number]) : getPreferredLocale(request);
    const suffix = pathname || '/';
    const normalizedSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`;

    const url = request.nextUrl.clone();
    url.pathname = `/${target}${normalizedSuffix === '/' ? '' : normalizedSuffix}`;
    serverLog('[middleware] redirecting to preferred locale', { from: pathname, to: url.pathname });
    return NextResponse.redirect(url);
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
