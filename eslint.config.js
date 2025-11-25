import eslint, { defineConfig } from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig(
  {
    ignores: ["dist/", "node_modules/", "**/*.d.ts", "coverage/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "prettier/prettier": "error",
    },
  }
);
