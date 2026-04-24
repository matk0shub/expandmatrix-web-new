/**
 * Client-side Sentry bootstrap. Same no-op-without-DSN rule: the bundle
 * imports the SDK only when a DSN is present, so disabled deploys ship ~0 kB
 * of Sentry code.
 */

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
      replaysSessionSampleRate: Number(
        process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SAMPLE_RATE ?? 0,
      ),
      replaysOnErrorSampleRate: Number(
        process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? 1.0,
      ),
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
      ],
    });
  });
}

export const onRouterTransitionStart = dsn
  ? (href: string, navigationType: 'push' | 'replace' | 'traverse') => {
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.captureRouterTransitionStart(href, navigationType);
      });
    }
  : undefined;
