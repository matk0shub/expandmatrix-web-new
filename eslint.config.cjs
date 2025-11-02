const { FlatCompat } = require('@eslint/eslintrc');
const nextPlugin = require('@next/eslint-plugin-next');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    plugins: {
      "@next/next": nextPlugin,
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      "node_modules.bak/**",
      "node_modules.old/**",
      ".next/**",
      "out/**",
      "build/**",
      "scripts/**",
      "docs/lighthouse/**",
      "next.config.ts",
      "tailwind.config.ts",
      "postcss.config.mjs",
      "desktop.config.js",
      "mobile.config.js",
      "tablet.config.js",
      "payload-types.ts",
      "generated-schema.graphql",
      "**/*.log",
      "next-env.d.ts",
    ],
  },
];

module.exports = eslintConfig;
