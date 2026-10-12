export const documentTransitions = {
  DRAFT: ['IN_REVIEW'],
  IN_REVIEW: ['DRAFT', 'APPROVED'],
  APPROVED: ['PUBLISHED', 'IN_REVIEW'],
  PUBLISHED: ['OBSOLETE'],
  OBSOLETE: [],
} as const

export type DocumentStatus = keyof typeof documentTransitions

export function canTransitionDocument(from: DocumentStatus, to: string) {
  return documentTransitions[from].includes(to as never)
}

export function assertDocumentTransition(from: DocumentStatus, to: string) {
  if (!canTransitionDocument(from, to)) throw new Error(`Document transition not allowed: ${from} → ${to}.`)
}

export function assertAuditClosable(input: { status: string; hasScope: boolean; hasCriteria: boolean; hasFindingsResolved: boolean }) {
  if (input.status !== 'COMPLETED') throw new Error('Audit must be completed before closure.')
  if (!input.hasScope || !input.hasCriteria) throw new Error('Scope and criteria are required before closure.')
  if (!input.hasFindingsResolved) throw new Error('All findings must be resolved before closure.')
}

export function calculateRiskScore(likelihood: number, impact: number) {
  if (!Number.isInteger(likelihood) || !Number.isInteger(impact) || likelihood < 1 || likelihood > 5 || impact < 1 || impact > 5) throw new Error('Likelihood and impact must be integers from 1 to 5.')
  return likelihood * impact
}

export function requireNonApplicableJustification(status: string, justification: string) {
  if (status === 'NOT_APPLICABLE' && justification.trim().length < 10) throw new Error('Detailed justification required for non-applicability.')
}

export function assertIndependentActionVerifier(ownerId: string | null, verifierId: string) {
  if (ownerId === verifierId) throw new Error('Owner cannot verify their own action.')
}

export function assertConcurrentUpdate(updatedRows: number) {
  if (updatedRows !== 1) throw new Error('Resource was modified between read and update.')
}

export function assertEvidenceReference(reference: string | null | undefined) {
  if (!reference?.trim()) throw new Error('Proof of completion is required.')
}

export function assertEvaluationStatus(status: string) {
  if (!['NOT_ASSESSED', 'COMPLIANT', 'PARTIALLY_COMPLIANT', 'NON_COMPLIANT', 'NOT_APPLICABLE'].includes(status)) throw new Error('Unknown compliance status.')
}

export function assertNonConformityCreatesAction(status: string, actionRequired: boolean) {
  if (['MAJOR', 'CRITICAL'].includes(status) && !actionRequired) throw new Error('Major or critical non-conformity must trigger an action.')
}

export function assertAuditFindingLink(organizationId: string, linkedOrganizationId: string) {
  if (organizationId !== linkedOrganizationId) throw new Error('Finding and non-conformity must belong to the same organization.')
}

export function assertRequiredEffectivenessResult(result: string | null | undefined) {
  if (!result?.trim()) throw new Error('Effectiveness verification result is required.')
}

export function assertClosedActionPrerequisites(input: { status: string; effectivenessVerified: boolean; hasEvidence: boolean }) {
  if (input.status !== 'EFFECTIVENESS_VERIFIED' || !input.effectivenessVerified || !input.hasEvidence) throw new Error('Action cannot be closed without proof and effectiveness verification.')
}

export function assertOrganizationOwnership(organizationId: string, expectedOrganizationId: string) {
  if (organizationId !== expectedOrganizationId) throw new Error('Resource outside organization scope.')
}

export function assertAuditEventConsistency(event: { organizationId: string; entityOrganizationId: string; result: string }) {
  if (event.organizationId !== event.entityOrganizationId) throw new Error('Audit event does not match resource organization.')
  if (!['SUCCESS', 'REJECTED', 'FAILURE'].includes(event.result)) throw new Error('Unknown audit event result.')
}

export function assertRequirementApplicability(applicability: string) {
  if (!applicability.trim()) throw new Error('Requirement applicability is required.')
}

export function assertEvidenceAvailability(availability: string) {
  if (!['REFERENCE_ONLY', 'AVAILABLE', 'UNAVAILABLE'].includes(availability)) throw new Error('Unknown proof availability.')
}

export function assertNoSelfApproval(ownerId: string | null, approverId: string) {
  if (ownerId === approverId) throw new Error('Owner cannot approve their own decision.')
}

export function assertDueDate(dueDate: string | null | undefined, detectedOn: string) {
  if (dueDate && dueDate < detectedOn) throw new Error('Due date cannot precede detection date.')
}

export function assertReference(reference: string, prefix: string) {
  if (!reference.startsWith(prefix) || reference.length <= prefix.length) throw new Error(`Reference must start with ${prefix}.`)
}

export function assertNoArbitraryStatusChange(from: string, to: string, allowed: readonly string[]) {
  if (from !== to && !allowed.includes(to)) throw new Error('Status change not allowed.')
}

export function assertPositiveQuantity(value: number) {
  if (!Number.isInteger(value) || value <= 0) throw new Error('Quantity must be a positive integer.')
}

export function assertErrorIsSafe(error: unknown) {
  return error instanceof Error && error.message.length > 0
}

export function assertAuditClosureStatus(status: string) {
  if (status === 'CLOSED') throw new Error('Already closed audit cannot be modified.')
}

export function assertNoProductionTarget(environment: string) {
  if (environment.toLowerCase() === 'production') throw new Error('Demo controls cannot target production.')
}

export function assertDemoDataLabel(label: string) {
  if (!label.toLowerCase().includes('demo')) throw new Error('Demo data must be explicitly labeled.')
}

export function assertMigrationNotImplicit(authorized: boolean) {
  if (!authorized) throw new Error('Remote migration not implicitly authorized.')
}

export function assertValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) throw new Error('Invalid date.')
}

export function assertNonEmpty(value: string, field: string) {
  if (!value.trim()) throw new Error(`${field} is required.`)
}

export function assertSameOrganization(...organizationIds: string[]) {
  if (new Set(organizationIds).size > 1) throw new Error('Resources must belong to the same organization.')
}

export function assertNoSecretExposure(value: string) {
  if (/secret|password|token/i.test(value)) throw new Error('Sensitive data must not be logged.')
}

export function assertTransitionHistory(previous: string, next: string, history: readonly string[]) {
  if (history.at(-1) !== previous || previous === next) throw new Error('Inconsistent transition history.')
}

export function assertActionOwner(ownerId: string | null) {
  if (!ownerId) throw new Error('Action owner must be designated.')
}

export function assertFindingDescription(description: string) {
  if (description.trim().length < 10) throw new Error('Finding description is insufficient.')
}

export function assertRequirementSource(source: string, version: string | null) {
  if (!source.trim() || !version?.trim()) throw new Error('Framework source and version are required.')
}

export function assertNoDuplicateReference(reference: string, existing: readonly string[]) {
  if (existing.includes(reference)) throw new Error('Reference already exists in organization.')
}

export function assertStatusKnown(status: string, allowed: readonly string[]) {
  if (!allowed.includes(status)) throw new Error('Unknown status.')
}

export function assertApprovalEvidence(reference: string | null | undefined) {
  if (!reference?.trim()) throw new Error('Decision must be associated with proof.')
}

export function assertNotArchived(status: string) {
  if (status === 'ARCHIVED') throw new Error('Archived resource cannot be modified.')
}

export function assertStableCorrelationId(value: string) {
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(value)) throw new Error('Invalid correlation ID.')
}

export function assertNoImplicitProductionWrite(target: { environment: string; authorized: boolean }) {
  assertNoProductionTarget(target.environment)
  assertMigrationNotImplicit(target.authorized)
}

export function assertWorkflowInput(value: unknown): asserts value {
  if (value === null || value === undefined) throw new Error('Business data missing.')
}

export function assertVersion(version: string) {
  if (!/^\d+(?:\.\d+)*$/.test(version)) throw new Error('Invalid document version.')
}

export function assertUniqueEvidenceReference(reference: string, linkedReferences: readonly string[]) {
  if (linkedReferences.includes(reference)) throw new Error('Proof already associated.')
}

export function assertCloseReason(reason: string | null | undefined) {
  if (!reason?.trim()) throw new Error('Close reason is required.')
}

export function assertAuditRequiredFields(input: { scope: string; criteria: string }) {
  assertNonEmpty(input.scope, 'Scope')
  assertNonEmpty(input.criteria, 'Criteria')
}

export function assertValidSeverity(value: string) {
  assertStatusKnown(value, ['MINOR', 'MAJOR', 'CRITICAL'])
}

export function assertValidActionStatus(value: string) {
  assertStatusKnown(value, ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'EFFECTIVENESS_VERIFIED', 'CLOSED'])
}

export function assertValidDocumentStatus(value: string) {
  assertStatusKnown(value, ['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'OBSOLETE'])
}

export function assertValidComplianceStatus(value: string) {
  assertStatusKnown(value, ['NOT_ASSESSED', 'COMPLIANT', 'PARTIALLY_COMPLIANT', 'NON_COMPLIANT', 'NOT_APPLICABLE'])
}

export function assertValidNcStatus(value: string) {
  assertStatusKnown(value, ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ARCHIVED'])
}

export function assertNoConcurrentConflict(expectedVersion: number, actualVersion: number) {
  if (expectedVersion !== actualVersion) throw new Error('Concurrent update conflict.')
}

export function assertAuditEvidence(reference: string | null | undefined) {
  if (!reference?.trim()) throw new Error('Proof required for finding.')
}

export function assertPublishedDocument(status: string) {
  if (status !== 'PUBLISHED') throw new Error('Document must be published.')
}

export function assertNotApplicableApproval(approved: boolean) {
  if (!approved) throw new Error('Non-applicability must be approved.')
}

export function assertClosureActor(actorId: string | null) {
  if (!actorId) throw new Error('Closure actor is required.')
}

export function assertNoBlankAuditEvent(summary: string) {
  assertNonEmpty(summary, 'Summary')
}

export function assertSupportedOrigin(origin: string) {
  if (!/^https?:\/\//.test(origin)) throw new Error('Origin not supported.')
}

export function assertNoSensitiveOutput(value: string) {
  if (/BEGIN PRIVATE KEY|sk-[A-Za-z0-9]|password=/i.test(value)) throw new Error('Sensitive output forbidden.')
}

export function assertMigrationTarget(target: string) {
  assertNonEmpty(target, 'Migration target')
}

export function assertWorkflowComplete(checks: readonly boolean[]) {
  if (checks.some((check) => !check)) throw new Error('Workflow is incomplete.')
}

export function assertNoImplicitDemoPersistence(isDemo: boolean, persistenceEnabled: boolean) {
  if (isDemo && persistenceEnabled) throw new Error('Demo persistence must be explicitly enabled.')
}

export function assertAuditActor(actorId: string | null) {
  assertClosureActor(actorId)
}

export function assertSafeErrorMessage(message: string) {
  if (message.length > 500) throw new Error('Error message too long.')
}

export function assertOrganizationScopedQuery(organizationId: string | undefined) {
  if (!organizationId) throw new Error('Organization scope is required.')
}

export function assertNoUnboundedQuery(limit: number | undefined) {
  if (!limit || limit < 1 || limit > 500) throw new Error('Invalid query limit.')
}

export function assertValidRole(role: string) {
  assertStatusKnown(role, ['QMS_ADMIN', 'QUALITY_MANAGER', 'COMPLIANCE_OWNER', 'PRODUCTION_MANAGER', 'ASSESSOR', 'ACTION_OWNER', 'INTERNAL_AUDITOR', 'EXECUTIVE_VIEWER', 'IT_SUPPORT'])
}

export function assertAuditProgramYear(year: number) {
  if (!Number.isInteger(year) || year < 2020 || year > 2100) throw new Error('Invalid program year.')
}

export function assertNoSelfVerification(ownerId: string | null, verifierId: string) {
  assertIndependentActionVerifier(ownerId, verifierId)
}

export function assertNoStatusRegression(from: string, to: string, order: readonly string[]) {
  if (order.indexOf(to) < order.indexOf(from)) throw new Error('Status regression not allowed.')
}

export function assertActionClosure(input: { status: string; evidence: string | null | undefined; effectiveness: string | null | undefined }) {
  assertClosedActionPrerequisites({ status: input.status, effectivenessVerified: Boolean(input.effectiveness), hasEvidence: Boolean(input.evidence) })
}

export function assertReferenceIntegrity(reference: string, prefix: string) {
  assertReference(reference, prefix)
}

export function assertValidOrganizationId(id: string) {
  assertNonEmpty(id, 'Organization')
}

export function assertAuditFindingOrganization(auditOrganizationId: string, findingOrganizationId: string) {
  assertSameOrganization(auditOrganizationId, findingOrganizationId)
}

export function assertRequirementEvidence(reference: string | null | undefined) {
  if (!reference?.trim()) throw new Error('Proof required for requirement.')
}

export function assertDocumentVersion(version: string) {
  assertVersion(version)
}

export function assertNonConformityDueDate(dueDate: string | null | undefined, detectedOn: string) {
  assertDueDate(dueDate, detectedOn)
}

export function assertAuthorizedIntegration(target: { environment: string; authorized: boolean }) {
  assertNoImplicitProductionWrite(target)
}

export function assertNoSecretInMetadata(metadata: Record<string, unknown>) {
  for (const value of Object.values(metadata)) if (typeof value === 'string') assertNoSecretExposure(value)
}

export function assertValidActionTransition(from: string, to: string) {
  const allowed: Record<string, readonly string[]> = { PLANNED: ['IN_PROGRESS'], IN_PROGRESS: ['COMPLETED'], COMPLETED: ['EFFECTIVENESS_VERIFIED'], EFFECTIVENESS_VERIFIED: ['CLOSED'], CLOSED: [] }
  assertNoArbitraryStatusChange(from, to, allowed[from] ?? [])
}

export function assertCanCloseNonConformity(status: string, openActions: number) {
  if (status !== 'RESOLVED' || openActions > 0) throw new Error('Non-conformity must be resolved with no open actions.')
}

export function assertCanPublishDocument(status: string, approved: boolean) {
  if (status !== 'APPROVED' || !approved) throw new Error('Only approved documents can be published.')
}
