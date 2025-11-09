import eslint from "@eslint/js"
import prettier from "eslint-config-prettier"
import tseslint from "typescript-eslint"

// Base ESLint config shared across packages (flat config)
export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/drizzle/**", "**/.expo/**", "**/*.d.ts", "**/eslint.config.js"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // place base rules here if needed
    },
  },
]
