export type IntegrationGateResult = {
  ok: boolean
  checks: Array<{ name: string; ok: boolean; detail: string }>
}

export function checkIntegrationGate(env: Readonly<Record<string, string | undefined>> = process.env): IntegrationGateResult {
  const checks = [
    {
      name: 'Cible identifiée',
      ok: Boolean(env.INTEGRATION_TARGET_NAME?.trim()),
      detail: env.INTEGRATION_TARGET_NAME?.trim() ? 'Nom de cible fourni.' : 'INTEGRATION_TARGET_NAME est requis.',
    },
    {
      name: 'Cible explicitement autorisée',
      ok: env.INTEGRATION_TARGET_AUTHORIZED === 'true',
      detail: env.INTEGRATION_TARGET_AUTHORIZED === 'true' ? 'Autorisation explicite fournie.' : 'INTEGRATION_TARGET_AUTHORIZED=true est requis.',
    },
    {
      name: 'Environnement non productif',
      ok: Boolean(env.INTEGRATION_TARGET_ENV?.trim()) && env.INTEGRATION_TARGET_ENV !== 'production',
      detail: env.INTEGRATION_TARGET_ENV === 'production' ? 'La production est interdite.' : 'Environnement non productif requis.',
    },
    {
      name: 'Base identifiée',
      ok: Boolean(env.INTEGRATION_DATABASE_NAME?.trim()),
      detail: env.INTEGRATION_DATABASE_NAME?.trim() ? 'Nom de base attendu fourni.' : 'INTEGRATION_DATABASE_NAME est requis.',
    },
  ]

  return { ok: checks.every((check) => check.ok), checks }
}

export function formatIntegrationGate(result: IntegrationGateResult) {
  return [`Porte d’intégration : ${result.ok ? 'OUVERTE' : 'BLOQUÉE'}`, ...result.checks.map((check) => `${check.ok ? 'OK' : 'BLOQUÉ'} — ${check.name}: ${check.detail}`)].join('\n')
}
