import { describe, expect, it } from 'vitest'
import { checkIntegrationGate, formatIntegrationGate } from './integration-gate'

describe('porte de contrôle d’intégration Better Auth', () => {
  it('reste bloquée sans cible et autorisation explicites', () => {
    const result = checkIntegrationGate({})
    expect(result.ok).toBe(false)
    expect(result.checks.every((check) => !check.ok)).toBe(true)
  })

  it('refuse explicitement la production', () => {
    const result = checkIntegrationGate({
      INTEGRATION_TARGET_NAME: 'demo',
      INTEGRATION_TARGET_AUTHORIZED: 'true',
      INTEGRATION_TARGET_ENV: 'production',
      INTEGRATION_DATABASE_NAME: 'demo',
    })
    expect(result.ok).toBe(false)
  })

  it('ouvre la porte uniquement avec une cible isolée explicitement autorisée', () => {
    const result = checkIntegrationGate({
      INTEGRATION_TARGET_NAME: 'sonarep-demo-isolated',
      INTEGRATION_TARGET_AUTHORIZED: 'true',
      INTEGRATION_TARGET_ENV: 'development',
      INTEGRATION_DATABASE_NAME: 'sonarep_demo',
    })
    expect(result.ok).toBe(true)
    expect(formatIntegrationGate(result)).toContain('OUVERTE')
  })
})
