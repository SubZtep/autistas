import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "../config/env.js"
import * as schema from "./schema.js"

// Create PostgreSQL connection
const client = postgres(env.DATABASE_URL)

// Create Drizzle instance
export const db = drizzle(client, { schema })

export * from "./schema.js"
