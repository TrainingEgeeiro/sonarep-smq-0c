import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

let pool: Pool | undefined

function getSupabaseConnectionString() {
  const host = process.env.SUPABASE_POSTGRES_HOST
  const user = process.env.SUPABASE_POSTGRES_USER
  const password = process.env.SUPABASE_POSTGRES_PASSWORD
  const database = process.env.SUPABASE_POSTGRES_DATABASE ?? "postgres"
  if (!host || !user || !password) return undefined
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:5432/${encodeURIComponent(database)}?sslmode=require`
}

export function getDatabase() {
  const connectionString = getSupabaseConnectionString() ?? process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for PostgreSQL-backed features. No database connection was attempted.")
  }
  pool ??= new Pool({ connectionString, max: 5 })
  return drizzle(pool, { schema })
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL)
}
