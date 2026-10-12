import { and, eq } from 'drizzle-orm'
import { auditEvents, complianceEvaluations, correctiveActions } from './db/schema'
import { getDb } from './db'
import { assertPermission, demoIdentity } from './governance'
import { complianceEvaluationInput, correctiveActionTransition } from './validation'

export async function createComplianceEvaluation(input: unknown) {
  assertPermission(demoIdentity.role, 'compliance.write')
  const value = complianceEvaluationInput.parse(input)
  const db = getDb()
  return db.transaction(async (tx) => {
    const [evaluation] = await tx.insert(complianceEvaluations).values({ organizationId: '00000000-0000-0000-0000-000000000001', requirementId: value.requirementId, scope: value.scope, evaluatedOn: value.evaluatedOn, status: value.status, justification: value.justification, evidenceReference: value.evidenceReference, createdBy: demoIdentity.id, updatedBy: demoIdentity.id }).returning()
    await tx.insert(auditEvents).values({ organizationId: evaluation.organizationId, eventType: 'COMPLIANCE_EVALUATION_CREATED', entityType: 'compliance_evaluation', entityId: evaluation.id, actorId: demoIdentity.id, result: 'SUCCESS', summary: `Évaluation ${value.status} créée` })
    return evaluation
  })
}

const allowedTransitions: Record<string, string[]> = { PLANNED: ['IN_PROGRESS'], IN_PROGRESS: ['COMPLETED'], COMPLETED: ['EFFECTIVENESS_VERIFIED'], EFFECTIVENESS_VERIFIED: ['CLOSED'], CLOSED: [] }
export async function transitionCorrectiveAction(input: unknown) {
  assertPermission(demoIdentity.role, 'actions.write')
  const value = correctiveActionTransition.parse(input)
  const db = getDb()
  return db.transaction(async (tx) => {
    const [current] = await tx.select({ id: correctiveActions.id, status: correctiveActions.status, organizationId: correctiveActions.organizationId }).from(correctiveActions).where(eq(correctiveActions.id, value.actionId)).limit(1)
    if (!current || !allowedTransitions[current.status]?.includes(value.nextStatus)) throw new Error('Transition de statut non autorisée.')
    const [updated] = await tx.update(correctiveActions).set({ status: value.nextStatus, effectivenessResult: value.effectivenessResult, updatedAt: new Date(), updatedBy: demoIdentity.id }).where(and(eq(correctiveActions.id, value.actionId), eq(correctiveActions.status, current.status))).returning()
    await tx.insert(auditEvents).values({ organizationId: current.organizationId, eventType: 'CORRECTIVE_ACTION_STATUS_CHANGED', entityType: 'corrective_action', entityId: current.id, actorId: demoIdentity.id, result: 'SUCCESS', summary: `Statut ${current.status} → ${value.nextStatus}` })
    return updated
  })
}
