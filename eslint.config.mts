import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jest from "eslint-plugin-jest";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,mts,cts}"],
    rules: {
      ...js.configs.recommended.rules,
      semi: ["error", "always"],
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          args: "after-used",
        },
      ],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        PRODUCTION: "readonly",
        PREFIX: "readonly",
      },
    },
  },
  {
    files: ["*.config.ts", "*.config.mts", "*.config.cts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["src/**/*.test.ts"],
    ...jest.configs["flat/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
]);
