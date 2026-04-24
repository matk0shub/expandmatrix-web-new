/**
 * Next.js instrumentation hook — runs once on both server and edge runtimes
 * when the app boots. We use it to wire up Sentry *only if* a DSN is
 * configured. Without a DSN all Sentry calls become cheap no-ops, so the
 * scaffold is safe to ship untouched.
 */

const shouldInitSentry = Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);

export async function register() {
  if (!shouldInitSentry) return;

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
      profilesSampleRate: 0,
      ignoreErrors: [
        // Next.js router abort signals when user navigates away mid-request.
        'NEXT_NOT_FOUND',
        'NEXT_REDIRECT',
      ],
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    });
  }
}

export const onRequestError = shouldInitSentry
  ? async (
      error: unknown,
      request: {
        path: string;
        method: string;
        headers: Record<string, string | string[] | undefined>;
      },
      context: { routerKind: string; routePath: string; routeType: string },
    ) => {
      const Sentry = await import('@sentry/nextjs');
      Sentry.captureRequestError(error, request, context);
    }
  : undefined;
