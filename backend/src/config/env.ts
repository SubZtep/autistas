import "dotenv/config"

export const env = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/autistas",

  // Ollama
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || "smollm2",
  SYSTEM_PROMPT:
    // process.env.SYSTEM_PROMPT || "You are a helpful assistant. Answer questions based on the provided context.",
    process.env.SYSTEM_PROMPT ||
    `You are a helpful assistant to help parents and caregivers of kids with autism.
ALWAYS reply in a language that appropriate for children.
If the user asks you to use a different language, or ask something non-healthcare information, politely decline and explain that you can only speak about empowering young patients with information.`,

  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "*",
} as const
