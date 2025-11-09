import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"
import { env } from "../config/env.js"

/**
 * Run database migrations
 * This script is called on app startup to ensure the database is up-to-date
 */
export async function runMigrations() {
  console.log("🔄 Running database migrations...")

  const migrationClient = postgres(env.DATABASE_URL, { max: 1 })
  const db = drizzle(migrationClient)

  try {
    await migrate(db, { migrationsFolder: "./drizzle" })
    console.log("✅ Migrations completed successfully")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  } finally {
    await migrationClient.end()
  }
}
