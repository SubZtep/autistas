import path from "node:path"
import { fileURLToPath } from "node:url"
import base from "../eslint.config.js"

export default [
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
      },
    },
  },
  ...base,
]
