import 'dotenv/config'
import { sql } from 'drizzle-orm'
import { getDb } from '../lib/db'

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL est requis. Aucun seed distant n’est lancé.')
  if (process.env.DEMO_MODE !== 'true' || process.env.DEMO_WRITE_ENABLED !== 'true') throw new Error('Le seed exige DEMO_MODE=true et DEMO_WRITE_ENABLED=true.')
  const db = getDb()
  await db.execute(sql`select 1`)
  console.log('Connexion PostgreSQL vérifiée. Le seed idempotent doit être appliqué après les migrations.')
}
main().catch((error) => { console.error(error instanceof Error ? error.message : 'Erreur seed'); process.exitCode = 1 })
