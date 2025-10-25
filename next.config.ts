import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { withPayload } from '@payloadcms/next/withPayload';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Disable source maps completely in development
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Disable source maps in development to prevent 404 errors
  webpack: (config, { dev, isServer }) => {
    // Completely disable source maps in development
    if (dev) {
      config.devtool = false;
      config.cache = false;
      config.parallelism = 1;
      // Disable source map generation
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
    }
    
    // Fix webpack module issues
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
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
        source: '/:all*.(avif|webp|svg|png|jpg|jpeg|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
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

export default withPayload(withNextIntl(nextConfig), { 
  devBundleServerPackages: false
});
