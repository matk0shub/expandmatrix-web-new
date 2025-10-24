import fs from 'fs';
import path from 'path';

import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { withPayload } from '@payloadcms/next/withPayload';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
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
  webpack: (config, { dev, isServer }) => {
    // Optimize cache for development to prevent corruption
    if (dev) {
      config.cache = false;
     config.parallelism = 1;
    }
    if (isServer) {
     class EnsureManifestsPlugin {
        private hasLogged = false;

        ensureBase(compiler: any) {
          const serverDir = compiler?.options?.output?.path || compiler.outputPath;
          if (!serverDir) return;

          if (!this.hasLogged && process.env.NODE_ENV !== 'production') {
            console.log(`[withPayload] Ensuring Next manifest stubs in ${serverDir}`);
            this.hasLogged = true;
          }

          const ensureDir = (target: string) => {
            if (!fs.existsSync(target)) {
              fs.mkdirSync(target, { recursive: true });
            }
          };

          ensureDir(serverDir);
          ensureDir(path.join(serverDir, 'vendor-chunks'));

          const fontManifest = { app: {}, pages: {} };
          const middlewareManifest = {
            version: 3,
            sortedMiddleware: [],
            middleware: {},
            functions: {},
          };
          const manifests: Array<{ file: string; contents: string }> = [
            {
              file: path.join(serverDir, 'next-font-manifest.json'),
              contents: JSON.stringify(fontManifest),
            },
            {
              file: path.join(serverDir, 'next-font-manifest.js'),
              contents: `self.__NEXT_FONT_MANIFEST=${JSON.stringify(fontManifest)};`,
            },
            {
              file: path.join(serverDir, 'middleware-manifest.json'),
              contents: JSON.stringify(middlewareManifest),
            },
            {
              file: path.join(serverDir, 'pages-manifest.json'),
              contents: JSON.stringify({}),
            },
            {
              file: path.join(serverDir, 'app-paths-manifest.json'),
              contents: JSON.stringify({}),
            },
            {
              file: path.join(serverDir, 'app-path-routes-manifest.json'),
              contents: JSON.stringify({}),
            },
            {
              file: path.join(serverDir, 'app-build-manifest.json'),
              contents: JSON.stringify({ pages: {} }),
            },
            {
              file: path.join(serverDir, 'vendor-chunks', '@opentelemetry.js'),
              contents: 'export {};',
            },
            {
              file: path.join(serverDir, 'vendor-chunks', 'next.js'),
              contents: 'module.exports = {};',
            },
          ];

          for (const manifest of manifests) {
            ensureDir(path.dirname(manifest.file));
            if (!fs.existsSync(manifest.file)) {
              fs.writeFileSync(manifest.file, manifest.contents);
              if (process.env.NODE_ENV !== 'production') {
                console.log(`[withPayload] Created stub ${path.relative(process.cwd(), manifest.file)}`);
              }
            }
          }
        }

        apply(compiler: any) {
          this.ensureBase(compiler);
          compiler.hooks.beforeRun.tap('EnsureManifestsPlugin', () => this.ensureBase(compiler));
          compiler.hooks.afterEmit.tap('EnsureManifestsPlugin', () => this.ensureBase(compiler));
        }
      }

      config.plugins = [...(config.plugins ?? []), new EnsureManifestsPlugin()];
    }
    return config;
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

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false });
