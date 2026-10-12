import { describe, expect, it } from 'vitest'
import { demoModeStatus, isUnauthenticatedDemoMode } from './demo-mode'

const env = (values: Record<string, string>) => values as NodeJS.ProcessEnv

describe('mode démonstration sans authentification', () => {
  it('reste désactivé par défaut', () => {
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'development' }))).toBe(false)
  })

  it('s’active uniquement avec le flag explicite hors production', () => {
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'development', QMS_DEMO_NO_AUTH: 'true' }))).toBe(true)
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'preview', QMS_DEMO_NO_AUTH: 'true' }))).toBe(true)
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'development', QMS_DEMO_NO_AUTH: '1' }))).toBe(false)
  })

  it('refuse impérativement le mode en production', () => {
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'production', QMS_DEMO_NO_AUTH: 'true' }))).toBe(false)
    expect(demoModeStatus(env({ NODE_ENV: 'production', QMS_DEMO_NO_AUTH: 'true' }))).toEqual({ enabled: false, requested: true, productionRefused: true })
  })
})
