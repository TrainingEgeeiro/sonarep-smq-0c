import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { getDatabase } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, status: "missing_configuration" }, { status: 503 })
  }

  try {
    await getDatabase().execute(sql`select 1`)
    return NextResponse.json({ ok: true, status: "connected" })
  } catch (error) {
    console.error("[database-health] PostgreSQL connectivity check failed", error instanceof Error ? error.message : "unknown error")
    return NextResponse.json({ ok: false, status: "connection_failed" }, { status: 503 })
  }
}
