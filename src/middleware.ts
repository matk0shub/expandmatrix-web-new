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

export default function middleware(request: NextRequest) {
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const hasCookieLocale = cookieLocale && locales.includes(cookieLocale as (typeof locales)[number]);
  const pathname = request.nextUrl.pathname;
  const currentLocale = getLocaleFromPath(pathname);
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdminRoute) {
    serverLog('[middleware] bypass intl for admin route', pathname)
    return NextResponse.next();
  }

  if (hasCookieLocale && cookieLocale !== currentLocale) {
    const localePrefixLength = currentLocale ? currentLocale.length + 1 : 0;
    const suffix = pathname.slice(localePrefixLength) || '/';
    const normalizedSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`;

    const url = request.nextUrl.clone();
    url.pathname = `/${cookieLocale}${normalizedSuffix === '/' ? '' : normalizedSuffix}`;
    serverLog('[middleware] redirecting to cookie locale', { from: pathname, to: url.pathname })
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
