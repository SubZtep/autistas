import "dotenv/config"

export const env = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/autistas",

  // Ollama
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL!,
  OLLAMA_MODEL: process.env.OLLAMA_MODEL!,

  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "*",
} as const
