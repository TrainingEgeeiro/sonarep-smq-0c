import { and, eq } from 'drizzle-orm'
import { auditEvents, controlledDocumentRevisions, controlledDocuments, evidence, evidenceAttachments, evidenceLinks } from './db/schema'
import { getDb } from './db'
import { AuthorizationError, requirePermission } from './authorization'
import { controlledDocumentInput, documentRevisionInput, documentRevisionTransition, evidenceAttachmentInput, evidenceInput, evidenceLinkInput } from './validation'
import { canTransitionDocumentRevision, requiredDocumentPermission } from './document-control-rules'


async function audit(organizationId: string, actorId: string, eventType: string, entityType: string, entityId: string, summary: string) {
  await getDb().insert(auditEvents).values({ organizationId, actorId, eventType, entityType, entityId, result: 'SUCCESS', summary })
}

export async function createControlledDocument(input: unknown) {
  const context = await requirePermission('documents.create')
  const value = controlledDocumentInput.parse(input)
  const [document] = await getDb().insert(controlledDocuments).values({ ...value, organizationId: context.organizationId, status: 'DRAFT', createdBy: context.userId, updatedBy: context.userId }).returning()
  await audit(context.organizationId, context.userId, 'DOCUMENT_CREATED', 'controlled_document', document.id, `Document ${document.reference} créé`)
  return document
}

export async function createDocumentRevision(input: unknown) {
  const context = await requirePermission('documents.update')
  const value = documentRevisionInput.parse(input)
  const db = getDb()
  const [document] = await db.select({ id: controlledDocuments.id }).from(controlledDocuments).where(and(eq(controlledDocuments.id, value.documentId), eq(controlledDocuments.organizationId, context.organizationId))).limit(1)
  if (!document) throw new Error('Document introuvable dans l’organisation courante.')
  const [revision] = await db.insert(controlledDocumentRevisions).values({ ...value, organizationId: context.organizationId, status: 'DRAFT' }).returning()
  await audit(context.organizationId, context.userId, 'DOCUMENT_REVISION_CREATED', 'controlled_document_revision', revision.id, `Révision ${revision.version} créée`)
  return revision
}

export async function transitionDocumentRevision(input: unknown) {
  const value = documentRevisionTransition.parse(input)
  const permission = requiredDocumentPermission(value.nextStatus)
  if (!permission) throw new Error('Transition documentaire inconnue.')
  const context = await requirePermission(permission)
  const db = getDb()
  const [current] = await db.select({ id: controlledDocumentRevisions.id, documentId: controlledDocumentRevisions.documentId, organizationId: controlledDocumentRevisions.organizationId, status: controlledDocumentRevisions.status, createdBy: controlledDocuments.createdBy }).from(controlledDocumentRevisions).innerJoin(controlledDocuments, eq(controlledDocuments.id, controlledDocumentRevisions.documentId)).where(and(eq(controlledDocumentRevisions.id, value.revisionId), eq(controlledDocumentRevisions.organizationId, context.organizationId))).limit(1)
  if (!current || !canTransitionDocumentRevision(current.status, value.nextStatus)) throw new Error('Transition documentaire non autorisée.')
  if (value.nextStatus === 'APPROVED' && current.createdBy === context.userId) throw new AuthorizationError('FORBIDDEN')
  const now = new Date()
  const [updated] = await db.update(controlledDocumentRevisions).set({ status: value.nextStatus, submittedAt: value.nextStatus === 'IN_REVIEW' ? now : undefined, approvedAt: value.nextStatus === 'APPROVED' ? now : undefined, approvedBy: value.nextStatus === 'APPROVED' ? context.userId : undefined, publishedAt: value.nextStatus === 'PUBLISHED' ? now : undefined, publishedBy: value.nextStatus === 'PUBLISHED' ? context.userId : undefined,   obsoleteAt: value.nextStatus === 'OBSOLETE' ? now : undefined, updatedAt: now }).where(and(eq(controlledDocumentRevisions.id, value.revisionId), eq(controlledDocumentRevisions.organizationId, context.organizationId), eq(controlledDocumentRevisions.status, current.status))).returning()
  if (!updated) throw new Error('La révision a été modifiée entre sa lecture et sa mise à jour.')
  await audit(context.organizationId, context.userId, `DOCUMENT_REVISION_${value.nextStatus}`, 'controlled_document_revision', updated.id, `Révision ${updated.version}: ${current.status} → ${value.nextStatus}. Motif: ${value.decisionReason}`)
  return updated
}

export async function createEvidence(input: unknown) {
  const context = await requirePermission('evidence.create')
  const value = evidenceInput.parse(input)
  const [record] = await getDb().insert(evidence).values({ ...value, organizationId: context.organizationId, availability: 'AVAILABLE', ownerId: context.userId, createdBy: context.userId, updatedBy: context.userId }).returning()
  await audit(context.organizationId, context.userId, 'EVIDENCE_CREATED', 'evidence', record.id, `Preuve ${record.reference} créée`)
  return record
}

export async function registerEvidenceAttachment(input: unknown) {
  const context = await requirePermission('evidence.create')
  const value = evidenceAttachmentInput.parse(input)
  const db = getDb()
  const [record] = await db.select({ id: evidence.id }).from(evidence).where(and(eq(evidence.id, value.evidenceId), eq(evidence.organizationId, context.organizationId))).limit(1)
  if (!record) throw new Error('Preuve introuvable dans l’organisation courante.')
  const [attachment] = await db.insert(evidenceAttachments).values({ ...value, organizationId: context.organizationId }).returning()
  await audit(context.organizationId, context.userId, 'EVIDENCE_ATTACHMENT_REGISTERED', 'evidence_attachment', attachment.id, `Pièce jointe ${attachment.fileName} enregistrée`)
  return attachment
}
