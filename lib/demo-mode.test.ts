import { describe, expect, it } from 'vitest'
import { demoModeStatus, isUnauthenticatedDemoMode } from './demo-mode'

const env = (values: Record<string, string>) => values as NodeJS.ProcessEnv

describe('mode démonstration sans authentification', () => {
  it('reste désactivé par défaut', () => {
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'development' }))).toBe(false)
  })

  it('autorise Preview Vercel et le développement local explicitement', () => {
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'production', VERCEL_ENV: 'preview', QMS_DEMO_NO_AUTH: 'true' }))).toBe(true)
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'development', QMS_DEMO_NO_AUTH: 'true' }))).toBe(true)
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'development', VERCEL_ENV: 'development', QMS_DEMO_NO_AUTH: 'true' }))).toBe(false)
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'development', QMS_DEMO_NO_AUTH: '1' }))).toBe(false)
  })

  it('refuse impérativement le mode en production Vercel', () => {
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'production', VERCEL_ENV: 'production', QMS_DEMO_NO_AUTH: 'true' }))).toBe(false)
    expect(demoModeStatus(env({ NODE_ENV: 'production', VERCEL_ENV: 'production', QMS_DEMO_NO_AUTH: 'true' }))).toEqual({ enabled: false, requested: true, productionRefused: true, environmentUnknown: false })
  })

  it('refuse par défaut les environnements inconnus ou incohérents', () => {
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'production', QMS_DEMO_NO_AUTH: 'true' }))).toBe(false)
    expect(isUnauthenticatedDemoMode(env({ NODE_ENV: 'development', VERCEL_ENV: 'production', QMS_DEMO_NO_AUTH: 'true' }))).toBe(false)
    expect(demoModeStatus(env({ NODE_ENV: 'test', QMS_DEMO_NO_AUTH: 'true' })).environmentUnknown).toBe(true)
  })
})
