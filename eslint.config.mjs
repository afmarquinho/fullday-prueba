import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Usamos <img> normal: las fotos ya están optimizadas en WebP y Cloudflare las sirve tal cual.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", ".open-next/**", "next-env.d.ts"]),
]);

export default eslintConfig;
