import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const baseNextConfigs = compat
  .extends('next/core-web-vitals', 'next/typescript')
  .map((config) => {
    if (config.plugins && config.plugins['@next/next']) {
      const cleanedConfig = { ...config };
      const restPlugins = { ...config.plugins };
      delete restPlugins['@next/next'];
      if (Object.keys(restPlugins).length > 0) {
        cleanedConfig.plugins = restPlugins;
      } else {
        delete cleanedConfig.plugins;
      }
      return cleanedConfig;
    }
    return config;
  });

const eslintConfig = [
  {
    plugins: {
      '@next/next': nextPlugin,
    },
  },
  ...baseNextConfigs,
  {
    ignores: [
      'node_modules/**',
      'node_modules.bak/**',
      'node_modules.old/**',
      '.next/**',
      'out/**',
      'build/**',
      'scripts/**',
      'docs/lighthouse/**',
      'next.config.ts',
      'tailwind.config.ts',
      'postcss.config.mjs',
      'desktop.config.js',
      'mobile.config.js',
      'tablet.config.js',
      'payload-types.ts',
      'generated-schema.graphql',
      '**/*.log',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
