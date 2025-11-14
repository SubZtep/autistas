import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"
import { env } from "../config/env.js"
import { readFileSync, readdirSync } from "fs"
import { join } from "path"

/**
 * Run database migrations with proper tracking
 * This script is called on app startup to ensure the database is up-to-date
 */
export async function runMigrations() {
  console.log("🔄 Running database migrations...")

  const migrationClient = postgres(env.DATABASE_URL, { max: 1 })
  const db = drizzle(migrationClient)

  try {
    // Ensure tracking table exists (workaround for Drizzle bug)
    await migrationClient`
      CREATE TABLE IF NOT EXISTS __drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash TEXT NOT NULL,
        created_at BIGINT
      )
    `

    // Get list of migration files
    const migrationsFolder = "./drizzle"
    const migrationFiles = readdirSync(migrationsFolder)
      .filter((file) => file.endsWith(".sql"))
      .sort()

    // Check which migrations have been applied
    const appliedMigrations = await migrationClient`
      SELECT hash FROM __drizzle_migrations
    `
    const appliedHashes = new Set(appliedMigrations.map((m) => m.hash))

    let appliedCount = 0

    // Apply each migration that hasn't been run yet
    for (const file of migrationFiles) {
      const migrationName = file.replace(".sql", "")

      if (appliedHashes.has(migrationName)) {
        continue // Skip already applied migrations
      }

      console.log(`  Applying migration: ${migrationName}`)

      const migrationSQL = readFileSync(join(migrationsFolder, file), "utf-8")

      // Split by statements and filter out empty ones and comments
      const statements = migrationSQL
        .split(/;[\s\n]*(?:-->.*)?/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("-->"))

      // Execute statements outside of transaction for idempotency
      let hasErrors = false
      for (const statement of statements) {
        try {
          await migrationClient.unsafe(statement)
        } catch (error: any) {
          // Ignore "already exists" errors for idempotency
          // 42P07 = duplicate_table (table/relation already exists)
          // 42710 = duplicate_object (constraint already exists)
          if (error.code === "42P07" || error.code === "42710") {
            console.log(`  ⚠️  Skipping: ${error.message}`)
          } else {
            console.error(`  ❌ Error executing statement: ${error.message}`)
            hasErrors = true
          }
        }
      }

      if (hasErrors) {
        throw new Error(`Migration ${migrationName} had errors`)
      }

      // Record migration as applied (in a separate transaction)
      await migrationClient`
        INSERT INTO __drizzle_migrations (hash, created_at)
        VALUES (${migrationName}, ${Date.now()})
        ON CONFLICT DO NOTHING
      `

      appliedCount++
    }

    if (appliedCount === 0) {
      console.log("✅ No new migrations to apply")
    } else {
      console.log(`✅ Applied ${appliedCount} migration(s)`)
    }

    // Show all applied migrations
    const allApplied = await migrationClient`
      SELECT hash, created_at FROM __drizzle_migrations ORDER BY id
    `
    console.log(`📊 Total migrations in database: ${allApplied.length}`)
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  } finally {
    await migrationClient.end()
  }
}
