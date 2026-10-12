import { describe, expect, it } from 'vitest'
import { assertDemoSeedAllowed } from './governance'
import { demoSeedPlan } from '../scripts/seed-demo'

describe('garde-fous du seed de démonstration', () => {
  const valid: NodeJS.ProcessEnv = { DATABASE_URL: 'postgresql://user:pass@localhost/sonarep_demo', DEMO_MODE: 'true', DEMO_WRITE_ENABLED: 'true', DEMO_TARGET: 'isolated-demo', DEMO_DATABASE_NAME: 'sonarep_demo', NODE_ENV: 'test' }
  it('refuse toute exécution non explicitement préparée', () => {
    expect(() => assertDemoSeedAllowed({ ...valid, DEMO_WRITE_ENABLED: 'false' })).toThrow()
    expect(() => assertDemoSeedAllowed({ ...valid, DEMO_TARGET: 'production' })).toThrow()
    expect(() => assertDemoSeedAllowed({ ...valid, VERCEL_ENV: 'production' })).toThrow()
    expect(() => assertDemoSeedAllowed({ ...valid, DEMO_DATABASE_NAME: 'autre_base' })).toThrow()
  })
  it('accepte uniquement une cible isolée contrôlable', () => expect(() => assertDemoSeedAllowed(valid)).not.toThrow())
  it('déclare des références stables et uniques', () => expect(new Set(demoSeedPlan.references).size).toBe(demoSeedPlan.references.length))
  it('ne prévoit aucune suppression destructive', () => expect(demoSeedPlan.references.some((reference) => reference.startsWith('DELETE'))).toBe(false))
})
