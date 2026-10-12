import { Pool } from 'pg'

export type DemoPreflightResult = {
  ok: boolean
  checks: Array<{ name: string; ok: boolean; detail: string }>
  databaseName?: string
  schemaName?: string
}

function requiredGuardChecks(env: NodeJS.ProcessEnv) {
  return [
    ['DEMO_DATABASE_NAME', Boolean(env.DEMO_DATABASE_NAME?.trim())],
    ['DEMO_TARGET=isolated-demo', env.DEMO_TARGET === 'isolated-demo'],
    ['DEMO_MODE=true', env.DEMO_MODE === 'true'],
    ['DEMO_WRITE_ENABLED=true', env.DEMO_WRITE_ENABLED === 'true'],
  ] as const
}

export async function runDemoPreflight(env: NodeJS.ProcessEnv = process.env): Promise<DemoPreflightResult> {
  const checks: DemoPreflightResult['checks'] = []
  const databaseUrl = env.DATABASE_URL?.trim()
  checks.push({ name: 'DATABASE_URL', ok: Boolean(databaseUrl), detail: databaseUrl ? 'Présente (valeur masquée).' : 'Absente.' })
  checks.push({ name: 'Cible de production', ok: env.NODE_ENV !== 'production' && env.VERCEL_ENV !== 'production', detail: 'Aucune cible de production explicitement détectée.' })

  for (const [name, ok] of requiredGuardChecks(env)) {
    checks.push({ name, ok, detail: ok ? 'Contrôle satisfait.' : 'Contrôle requis non satisfait.' })
  }

  if (!databaseUrl) return { ok: false, checks }

  let pool: Pool | undefined
  try {
    pool = new Pool({ connectionString: databaseUrl, max: 1 })
    const result = await pool.query<{ database_name: string; schema_name: string }>('select current_database() as database_name, current_schema() as schema_name')
    const databaseName = result.rows[0]?.database_name
    const schemaName = result.rows[0]?.schema_name
    const expectedName = env.DEMO_DATABASE_NAME?.trim()
    checks.push({ name: 'Connexion PostgreSQL', ok: true, detail: 'Connexion établie.' })
    checks.push({ name: 'Identité de la base', ok: databaseName === expectedName, detail: databaseName === expectedName ? 'Nom réel conforme à DEMO_DATABASE_NAME.' : 'Nom réel différent de DEMO_DATABASE_NAME.' })
    checks.push({ name: 'Schéma cible', ok: schemaName === 'public', detail: schemaName === 'public' ? 'Schéma public confirmé.' : `Schéma inattendu: ${schemaName ?? 'inconnu'}.` })
    return { ok: checks.every((check) => check.ok), checks, databaseName, schemaName }
  } catch {
    checks.push({ name: 'Connexion PostgreSQL', ok: false, detail: 'Connexion indisponible ou identité non vérifiable.' })
    return { ok: false, checks }
  } finally {
    await pool?.end().catch(() => undefined)
  }
}

export function formatDemoPreflight(result: DemoPreflightResult) {
  const lines = result.checks.map((check) => `${check.ok ? 'OK' : 'BLOQUÉ'} — ${check.name}: ${check.detail}`)
  return [`Prévalidation SONAREP QMS 360: ${result.ok ? 'AUTORISÉE' : 'BLOQUÉE'}`, ...lines].join('\n')
}
