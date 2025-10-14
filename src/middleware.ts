import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'cs'],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Always show the locale in the URL
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all paths except for Next.js internals and static files
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match root path
    '/',
    // Match locale paths
    '/(en|cs)/:path*'
  ]
};
