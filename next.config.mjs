import createNextIntlPlugin from 'next-intl/plugin';
import createBundleAnalyzer from '@next/bundle-analyzer';
import { withPayload } from '@payloadcms/next/withPayload';
import fs from 'node:fs';
import path from 'node:path';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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

const serverOutputDir = path.join(process.cwd(), '.next', 'server');
const serverBackupDir = path.join(process.cwd(), '.next', '.server-backup');

const dirExists = async (dir) => {
  try {
    const stats = await fs.promises.stat(dir);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

const copyDirectory = async (source, destination) => {
  const cp = (fs.promises?.cp);

  const ensureParent = async (dir) => {
    await fs.promises.mkdir(path.dirname(dir), { recursive: true });
  };

  if (cp) {
    await fs.promises.rm(destination, { recursive: true, force: true }).catch(() => undefined);
    await ensureParent(destination);
    await cp(source, destination, { recursive: true });
    return;
  }

  const recursiveCopy = async (src, dest) => {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await recursiveCopy(srcPath, destPath);
      } else if (entry.isSymbolicLink()) {
        const linkTarget = await fs.promises.readlink(srcPath);
        await fs.promises.symlink(linkTarget, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  };

  await fs.promises.rm(destination, { recursive: true, force: true }).catch(() => undefined);
  await ensureParent(destination);
  await recursiveCopy(source, destination);
};

let preserveIntervalStarted = false;
let backingUp = false;
let restoring = false;

class EnsurePagesManifestPlugin {
  async ensureArtifacts() {
    const serverDir = path.join(process.cwd(), '.next', 'server');
    const vendorDir = path.join(serverDir, 'vendor-chunks');

    try {
      await fs.promises.mkdir(serverDir, { recursive: true });
      await fs.promises.mkdir(vendorDir, { recursive: true });
    } catch (error) {
      console.warn('[next.config] Failed to create .next/server directories:', error);
      return;
    }

    const fontManifest = { app: {}, pages: {} };
    const middlewareManifest = { version: 3, sortedMiddleware: [], middleware: {}, functions: {} };
    const stubs = [
      { file: path.join(serverDir, 'pages-manifest.json'), contents: JSON.stringify({}) },
      { file: path.join(serverDir, 'functions-config-manifest.json'), contents: JSON.stringify({ functions: {}, version: 1 }) },
      { file: path.join(serverDir, 'middleware-manifest.json'), contents: JSON.stringify(middlewareManifest) },
      { file: path.join(serverDir, 'app-paths-manifest.json'), contents: JSON.stringify({}) },
      { file: path.join(serverDir, 'app-path-routes-manifest.json'), contents: JSON.stringify({}) },
      { file: path.join(serverDir, 'app-build-manifest.json'), contents: JSON.stringify({ pages: {} }) },
      { file: path.join(serverDir, 'next-font-manifest.json'), contents: JSON.stringify(fontManifest) },
      { file: path.join(serverDir, 'next-font-manifest.js'), contents: `self.__NEXT_FONT_MANIFEST=${JSON.stringify(fontManifest)};` },
      { file: path.join(vendorDir, '@opentelemetry.js'), contents: 'export {};' },
      { file: path.join(vendorDir, 'next.js'), contents: 'module.exports = {};' },
    ];

    for (const stub of stubs) {
      try {
        await fs.promises.access(stub.file, fs.constants.F_OK);
      } catch {
        try {
          await fs.promises.writeFile(stub.file, stub.contents, 'utf-8');
        } catch (error) {
          console.warn(`[next.config] Failed to seed ${path.basename(stub.file)}:`, error);
        }
      }
    }
  }

  apply(compiler) {
    const ensure = this.ensureArtifacts.bind(this);
    compiler.hooks.beforeCompile.tapPromise('EnsurePagesManifestPlugin', ensure);
    compiler.hooks.afterEmit.tapPromise('EnsurePagesManifestPlugin', ensure);
  }
}

class PreserveNextServerArtifactsPlugin {
  async syncBackup() {
    if (backingUp || !(await dirExists(serverOutputDir))) {
      return;
    }

    backingUp = true;
    try {
      await copyDirectory(serverOutputDir, serverBackupDir);
    } catch (error) {
      console.warn('[next.config] Failed to back up Next server artifacts:', error);
    } finally {
      backingUp = false;
    }
  }

  async restoreIfMissing() {
    if (restoring || (await dirExists(serverOutputDir)) || !(await dirExists(serverBackupDir))) {
      return;
    }

    restoring = true;
    try {
      await copyDirectory(serverBackupDir, serverOutputDir);
    } catch (error) {
      console.warn('[next.config] Failed to restore Next server artifacts:', error);
    } finally {
      restoring = false;
    }
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise('PreserveNextServerArtifactsPlugin', async () => {
      await this.syncBackup();
    });

    if (!preserveIntervalStarted) {
      preserveIntervalStarted = true;

      const tick = async () => {
        if (await dirExists(serverOutputDir)) {
          await this.syncBackup();
        } else {
          await this.restoreIfMissing();
        }
      };

      void tick();

      const timer = setInterval(() => {
        void tick();
      }, 250);

      if (typeof timer.unref === 'function') {
        timer.unref();
      }
    }
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
  webpack: (config, { dev, isServer }) => {
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

    if (isServer) {
      config.plugins = config.plugins ?? [];
      config.plugins.push(new EnsurePagesManifestPlugin());
    }

    // PreserveNextServerArtifactsPlugin was intended to cache .next/server outputs between builds,
    // but it causes noisy copy failures and slows down compilation. Admin assets are rebuilt on demand
    // so we can drop the plugin entirely for both dev and prod.

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
