import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

let pool: Pool | undefined

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for PostgreSQL-backed features. No database connection was attempted.")
  }
  pool ??= new Pool({ connectionString, max: 5 })
  return drizzle(pool, { schema })
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL)
}
