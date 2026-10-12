import "dotenv/config"
import { defineConfig } from "drizzle-kit"

const supabaseConnectionString = process.env.SUPABASE_POSTGRES_HOST && process.env.SUPABASE_POSTGRES_USER && process.env.SUPABASE_POSTGRES_PASSWORD
  ? `postgresql://${encodeURIComponent(process.env.SUPABASE_POSTGRES_USER)}:${encodeURIComponent(process.env.SUPABASE_POSTGRES_PASSWORD)}@${process.env.SUPABASE_POSTGRES_HOST}:5432/${encodeURIComponent(process.env.SUPABASE_POSTGRES_DATABASE ?? "postgres")}?sslmode=require`
  : undefined

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: supabaseConnectionString ?? process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "" },
  strict: true,
  verbose: true,
})
