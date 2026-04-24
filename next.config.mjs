import createNextIntlPlugin from 'next-intl/plugin';
import createBundleAnalyzer from '@next/bundle-analyzer';
import { withPayload } from '@payloadcms/next/withPayload';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);
const hostedEnvHints = [
  process.env.VERCEL,
  process.env.NETLIFY,
  process.env.URL,
  process.env.SITE_URL,
  process.env.DEPLOY_URL,
  process.env.DEPLOY_PRIME_URL,
  process.env.DEPLOY_PREVIEW_URL,
];
const isHostedEnv =
  hostedEnvHints.some((value) => typeof value === 'string' && value.length > 0) ||
  Boolean(process.env.CI && process.env.CI !== 'false' && process.env.CI !== '0');
const allowLocalPayloadHost = process.env.ALLOW_LOCAL_PAYLOAD_URL === 'true' || !isHostedEnv;

const payloadUrlCandidates = [
  process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL,
  process.env.PAYLOAD_PUBLIC_SERVER_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.SITE_URL,
  process.env.URL,
  process.env.DEPLOY_URL,
  process.env.DEPLOY_PRIME_URL,
  process.env.DEPLOY_PREVIEW_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
];

const normalizeBaseUrl = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/+/, '')}`;

  try {
    const url = new URL(withProtocol);
    if (!allowLocalPayloadHost && LOCAL_HOSTNAMES.has(url.hostname.toLowerCase())) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
};

const payloadServerUrl =
  payloadUrlCandidates.reduce((resolved, candidate) => {
    if (resolved) return resolved;
    return normalizeBaseUrl(candidate) ?? '';
  }, '') || '';

const imageRemotePatterns = [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
  {
    protocol: 'https',
    hostname: 'cms.expandmatrix.com',
  },
];

if (payloadServerUrl) {
  try {
    const parsed = new URL(payloadServerUrl);
    imageRemotePatterns.push({
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
    });
  } catch (error) {
    console.warn(
      '[next.config] Invalid PAYLOAD_PUBLIC_SERVER_URL/NEXT_PUBLIC_PAYLOAD_SERVER_URL:',
      error instanceof Error ? error.message : error,
    );
  }
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: false,
  },
  serverExternalPackages: [
    'payload',
    '@payloadcms/db-mongodb',
    '@payloadcms/richtext-lexical',
    'sharp',
    'nodemailer',
  ],
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false;
      config.cache = {
        type: 'filesystem',
      };
    }

    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        os: false,
      },
    };

    return config;
  },
  images: {
    remotePatterns: imageRemotePatterns,
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*.(avif|webp|svg|png|jpg|jpeg|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:locale(en|cs)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=600, stale-while-revalidate=600',
          },
          {
            key: 'Vary',
            value: 'Accept-Language, Cookie',
          },
        ],
      },
      {
        source: '/:locale(en|cs)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=600, stale-while-revalidate=600',
          },
          {
            key: 'Vary',
            value: 'Accept-Language, Cookie',
          },
        ],
      },
      // Blog: force-dynamic pages — no CDN cache (must come AFTER the generic /:locale/:path* rule)
      {
        source: '/:locale(en|cs)/blog',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      {
        source: '/:locale(en|cs)/blog/:slug*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(
  withPayload(withNextIntl(nextConfig), {
    devBundleServerPackages: false,
  }),
);
