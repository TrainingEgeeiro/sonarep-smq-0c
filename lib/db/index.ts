import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

let pool: Pool | undefined

export function getDatabaseUrl() { return process.env.DATABASE_URL?.trim() || null }
export function getPersistenceStatus() {
  if (!getDatabaseUrl()) return { mode: 'unconfigured' as const, label: 'PostgreSQL non configuré' }
  return { mode: 'configured' as const, label: 'PostgreSQL configuré (connexion à vérifier)' }
}
export function getDb() {
  const url = getDatabaseUrl()
  if (!url) throw new Error('DATABASE_URL est requis pour cette opération serveur.')
  pool ??= new Pool({ connectionString: url, max: 3 })
  return drizzle(pool, { schema })
}
export async function verifyDatabase() {
  const url = getDatabaseUrl()
  if (!url) return { available: false, reason: 'DATABASE_URL absente' }
  try { pool ??= new Pool({ connectionString: url, max: 3 }); await pool.query('select 1'); return { available: true as const } }
  catch { return { available: false as const, reason: 'Connexion PostgreSQL indisponible' } }
}
