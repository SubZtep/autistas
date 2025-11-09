import 'dotenv/config';

export const env = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/autistas',

  // LLM API
  LLM_API_URL: process.env.LLM_API_URL || 'http://localhost:5001',
  LLM_API_KEY: process.env.LLM_API_KEY || '',

  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || '*',
} as const;
