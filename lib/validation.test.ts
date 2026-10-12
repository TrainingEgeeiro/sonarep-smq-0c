import { describe, expect, it } from 'vitest'
import { hasPermission } from './governance'
import { complianceEvaluationInput } from './validation'

describe('validation métier', () => {
  it('exige une justification suffisante pour non applicable', () => {
    const result = complianceEvaluationInput.safeParse({ requirementId: '00000000-0000-0000-0000-000000000001', scope: 'Démonstration', evaluatedOn: '2026-10-12', status: 'NOT_APPLICABLE', justification: 'court' })
    expect(result.success).toBe(false)
  })
  it('ne donne pas les droits d’écriture au lecteur exécutif', () => {
    expect(hasPermission('EXECUTIVE_VIEWER', 'compliance.write')).toBe(false)
    expect(hasPermission('QUALITY_MANAGER', 'compliance.write')).toBe(true)
  })
})
