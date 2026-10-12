import { and, eq } from 'drizzle-orm'
import { evidence, evidenceLinks, auditEvents } from './db/schema'
import { getDb } from './db'
import { requirePermission } from './authorization'
import { evidenceLinkInput } from './validation'

export async function linkEvidence(input: unknown) {
  const context = await requirePermission('evidence.create')
  const value = evidenceLinkInput.parse(input)
  const db = getDb()
  const [record] = await db.select({ id: evidence.id }).from(evidence).where(and(eq(evidence.id, value.evidenceId), eq(evidence.organizationId, context.organizationId))).limit(1)
  if (!record) throw new Error('Preuve introuvable dans l’organisation courante.')
  const [link] = await db.insert(evidenceLinks).values({ ...value, organizationId: context.organizationId }).returning()
  await db.insert(auditEvents).values({ organizationId: context.organizationId, actorId: context.userId, eventType: 'EVIDENCE_LINKED', entityType: value.entityType, entityId: value.entityId, result: 'SUCCESS', summary: `Preuve ${value.evidenceId} liée à ${value.entityType}` })
  return link
}

export async function listEvidenceLinks(evidenceId: string) {
  const context = await requirePermission('evidence.read')
  return getDb().select().from(evidenceLinks).where(and(eq(evidenceLinks.evidenceId, evidenceId), eq(evidenceLinks.organizationId, context.organizationId)))
}
