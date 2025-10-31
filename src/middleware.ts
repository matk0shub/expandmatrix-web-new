import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

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

  if (hasCookieLocale && cookieLocale !== currentLocale) {
    const localePrefixLength = currentLocale ? currentLocale.length + 1 : 0;
    const suffix = pathname.slice(localePrefixLength) || '/';
    const normalizedSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`;

    const url = request.nextUrl.clone();
    url.pathname = `/${cookieLocale}${normalizedSuffix === '/' ? '' : normalizedSuffix}`;
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
