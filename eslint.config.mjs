import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

export default eslintConfig;
