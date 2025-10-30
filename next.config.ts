import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import createBundleAnalyzer from '@next/bundle-analyzer';
import { withPayload } from '@payloadcms/next/withPayload';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const payloadServerUrl =
  process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL ??
  process.env.PAYLOAD_PUBLIC_SERVER_URL ??
  '';

const imageRemotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
];

if (payloadServerUrl) {
  try {
    const parsed = new URL(payloadServerUrl);
    imageRemotePatterns.push({
      protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
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

let ensureManifestIntervalStarted = false;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Minimal webpack configuration for faster dev server
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.devtool = false;
      
      // Optimize webpack performance in dev
      config.cache = {
        type: 'filesystem',
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
    
    if (isServer) {
      class EnsureNextDevManifestsPlugin {
        ensureManifests() {
          const serverDir = path.join(process.cwd(), '.next', 'server');
          
          try {
            mkdirSync(serverDir, { recursive: true });
            const vendorChunksDir = path.join(serverDir, 'vendor-chunks');
            mkdirSync(vendorChunksDir, { recursive: true });
            
            const fontManifest = { app: {}, pages: {} };
            const middlewareManifest = {
              version: 3,
              sortedMiddleware: [],
              middleware: {},
              functions: {},
            };
            
            const stubs: Array<{ file: string; contents: string }> = [
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
                file: path.join(serverDir, 'server-reference-manifest.json'),
                contents: JSON.stringify({}),
              },
              {
                file: path.join(vendorChunksDir, '@opentelemetry.js'),
                contents: 'module.exports = {};'
              },
              {
                file: path.join(vendorChunksDir, '@payloadcms.js'),
                contents: 'module.exports = {};'
              },
              {
                file: path.join(vendorChunksDir, '@swc.js'),
                contents: 'module.exports = {};'
              },
              {
                file: path.join(vendorChunksDir, 'payload.js'),
                contents: 'module.exports = {};'
              },
              {
                file: path.join(vendorChunksDir, 'next.js'),
                contents: 'module.exports = [];'
              },
            ];
            
            for (const stub of stubs) {
              if (!existsSync(stub.file)) {
                writeFileSync(stub.file, stub.contents);
              }
            }

            // Also ensure client static manifests if BUILD_ID is available
            try {
              const buildIdFile = path.join(process.cwd(), '.next', 'BUILD_ID');
              if (existsSync(buildIdFile)) {
                const buildId = String(require('node:fs').readFileSync(buildIdFile)).trim();
                if (buildId) {
                  const staticDir = path.join(process.cwd(), '.next', 'static', buildId);
                  mkdirSync(staticDir, { recursive: true });
                  const ssgManifestPath = path.join(staticDir, '_ssgManifest.js');
                  const buildManifestPath = path.join(staticDir, '_buildManifest.js');
                  if (!existsSync(ssgManifestPath)) {
                    writeFileSync(
                      ssgManifestPath,
                      'self.__SSG_MANIFEST=new Set();self.__SSG_MANIFEST_CB&&self.__SSG_MANIFEST_CB()'
                    );
                  }
                  if (!existsSync(buildManifestPath)) {
                    writeFileSync(
                      buildManifestPath,
                      'self.__BUILD_MANIFEST={};self.__BUILD_MANIFEST_CB&&self.__BUILD_MANIFEST_CB()'
                    );
                  }
                }
              }
            } catch (_) {
              // ignore
            }
            
            if (process.env.DEBUG_NEXT_MANIFESTS === 'true') {
              console.log('[next.config] ensured dev manifest stubs');
            }
          } catch (error) {
            console.warn('[next.config] Failed to ensure dev manifests:', error);
          }
        }
        
        apply(compiler: unknown) {
          const ensure = () => this.ensureManifests();
          
          if (!ensureManifestIntervalStarted) {
            ensureManifestIntervalStarted = true;
            ensure();
            setInterval(ensure, 200);
          }
          
          if (
            typeof compiler === 'object' &&
            compiler &&
            'hooks' in compiler &&
            typeof (compiler as { hooks?: unknown }).hooks === 'object'
          ) {
            const typedCompiler = compiler as {
              hooks: {
                beforeCompile?: { tap: (name: string, handler: () => void) => void };
                afterEmit: { tap: (name: string, handler: () => void) => void };
                done: { tap: (name: string, handler: () => void) => void };
              };
            };
            
            typedCompiler.hooks.beforeCompile?.tap('EnsureNextDevManifestsPlugin', ensure);
            typedCompiler.hooks.afterEmit.tap('EnsureNextDevManifestsPlugin', ensure);
            typedCompiler.hooks.done.tap('EnsureNextDevManifestsPlugin', ensure);
          } else {
            // Fallback execution in case webpack internals change
            ensure();
          }
        }
      }
      
      config.plugins = config.plugins ?? [];
      config.plugins.push(new EnsureNextDevManifestsPlugin());
    }
    
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

export default withBundleAnalyzer(
  withPayload(withNextIntl(nextConfig), {
    devBundleServerPackages: true,
  }),
);
