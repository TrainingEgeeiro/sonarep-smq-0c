"use server"

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"
import { getDatabase } from "@/lib/db"
import { auditEvents, documentProcesses, documentRequirements, documentRevisions, documents, organizations, processes, requirements } from "@/lib/db/schema"
import { documentInputSchema, documentRevisionSchema, documentTransitionSchema } from "@/lib/validation"

const transitionMap = {
  SUBMIT_VERIFICATION: { from: "DRAFT", to: "SUBMITTED_FOR_VERIFICATION", event: "DOCUMENT_SUBMITTED_FOR_VERIFICATION" },
  START_VERIFICATION: { from: "SUBMITTED_FOR_VERIFICATION", to: "IN_VERIFICATION", event: "DOCUMENT_VERIFICATION_STARTED" },
  SUBMIT_APPROVAL: { from: "IN_VERIFICATION", to: "SUBMITTED_FOR_APPROVAL", event: "DOCUMENT_SUBMITTED_FOR_APPROVAL" },
  APPROVE: { from: "SUBMITTED_FOR_APPROVAL", to: "APPROVED", event: "DOCUMENT_APPROVED" },
  PUBLISH: { from: "APPROVED", to: "PUBLISHED", event: "DOCUMENT_PUBLISHED" },
  ARCHIVE: { from: "PUBLISHED", to: "ARCHIVED", event: "DOCUMENT_ARCHIVED" },
  OBSOLETE: { from: "PUBLISHED", to: "OBSOLETE", event: "DOCUMENT_OBSOLETE" },
} as const

async function assertLinks(db: ReturnType<typeof getDatabase>, organizationId: string, processIds: string[], requirementIds: string[]) {
  if (processIds.length) {
    const rows = await db.select({ id: processes.id }).from(processes).where(and(eq(processes.organizationId, organizationId), inArray(processes.id, processIds)))
    if (rows.length !== new Set(processIds).size) throw new Error("Un processus lié n'appartient pas à l'organisation.")
  }
  if (requirementIds.length) {
    const rows = await db.select({ id: requirements.id }).from(requirements).where(and(eq(requirements.organizationId, organizationId), inArray(requirements.id, requirementIds)))
    if (rows.length !== new Set(requirementIds).size) throw new Error("Une exigence liée n'appartient pas à l'organisation.")
  }
}

export async function listDocuments() {
  const db = getDatabase()
  const rows = await db.select({ document: documents, revision: documentRevisions }).from(documents).leftJoin(documentRevisions, eq(documents.currentRevisionId, documentRevisions.id)).where(sql`${documents.deletedAt} is null`).orderBy(desc(documents.updatedAt))
  const [all, published, review, overdue] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(documents).where(sql`${documents.deletedAt} is null`),
    db.select({ count: sql<number>`count(*)::int` }).from(documents).where(and(eq(documents.status, "PUBLISHED"), sql`${documents.deletedAt} is null`)),
    db.select({ count: sql<number>`count(*)::int` }).from(documents).where(and(inArray(documents.status, ["SUBMITTED_FOR_VERIFICATION", "IN_VERIFICATION", "SUBMITTED_FOR_APPROVAL"]), sql`${documents.deletedAt} is null`)),
    db.select({ count: sql<number>`count(*)::int` }).from(documents).where(and(sql`${documents.nextReviewOn} < current_date`, sql`${documents.deletedAt} is null`)),
  ])
  return { rows, metrics: { total: all[0]?.count ?? 0, published: published[0]?.count ?? 0, inReview: review[0]?.count ?? 0, overdue: overdue[0]?.count ?? 0 } }
}

export async function listOrganizations() {
  return getDatabase().select({ id: organizations.id, code: organizations.code, name: organizations.name }).from(organizations).where(sql`${organizations.deletedAt} is null`).orderBy(asc(organizations.code))
}

export async function listDocumentOptions(organizationId: string) {
  const db = getDatabase()
  const [processOptions, requirementOptions] = await Promise.all([
    db.select({ id: processes.id, code: processes.code, name: processes.name }).from(processes).where(eq(processes.organizationId, organizationId)).orderBy(asc(processes.code)),
    db.select({ id: requirements.id, code: requirements.code, title: requirements.title }).from(requirements).where(eq(requirements.organizationId, organizationId)).orderBy(asc(requirements.code)),
  ])
  return { processOptions, requirementOptions }
}

export async function createDocument(input: unknown) {
  const value = documentInputSchema.parse(input)
  if (!value.organizationId) throw new Error("Une organisation est requise pour créer un document.")
  const organizationId = value.organizationId
  const db = getDatabase()
  await assertLinks(db, organizationId, value.processIds, value.requirementIds)
  return db.transaction(async (tx) => {
    const [document] = await tx.insert(documents).values({ organizationId, code: value.code, title: value.title, description: value.description, type: value.type, classification: value.classification, functionalOwnerReference: value.functionalOwnerReference, ...(value.processOwnerId ? { processOwnerId: value.processOwnerId } : {}), ...(value.nextReviewOn ? { nextReviewOn: value.nextReviewOn } : {}) }).returning()
    const [revision] = await tx.insert(documentRevisions).values({ documentId: document.id, revisionNumber: 1, status: "DRAFT", changeSummary: "Version initiale", origin: "UNVERIFIED_OPERATOR" }).returning()
    await tx.update(documents).set({ currentRevisionId: revision.id }).where(eq(documents.id, document.id))
    if (value.processIds.length) await tx.insert(documentProcesses).values(value.processIds.map((processId) => ({ documentId: document.id, processId })))
    if (value.requirementIds.length) await tx.insert(documentRequirements).values(value.requirementIds.map((requirementId) => ({ documentId: document.id, requirementId })))
    await tx.insert(auditEvents).values({ eventType: "DOCUMENT_CREATED", entityType: "DOCUMENT", entityId: document.id, origin: "UNVERIFIED_OPERATOR", context: { revisionId: revision.id } })
    return { ...document, currentRevisionId: revision.id }
  })
}

export async function createRevision(input: unknown) {
  const value = documentRevisionSchema.parse(input)
  const db = getDatabase()
  return db.transaction(async (tx) => {
    const [document] = await tx.select().from(documents).where(eq(documents.id, value.documentId))
    if (!document) throw new Error("Document introuvable.")
    if (["ARCHIVED", "OBSOLETE"].includes(document.status)) throw new Error("Un document archivé ou obsolète ne peut plus être révisé.")
    const [latest] = await tx.select({ revisionNumber: documentRevisions.revisionNumber }).from(documentRevisions).where(eq(documentRevisions.documentId, document.id)).orderBy(desc(documentRevisions.revisionNumber)).limit(1)
    const [revision] = await tx.insert(documentRevisions).values({ documentId: document.id, revisionNumber: (latest?.revisionNumber ?? 0) + 1, status: "DRAFT", changeSummary: value.changeSummary, storageKey: value.storageKey, origin: "UNVERIFIED_OPERATOR" }).returning()
    await tx.update(documents).set({ status: "DRAFT", currentRevisionId: revision.id, lastRevisedAt: new Date(), updatedAt: new Date() }).where(eq(documents.id, document.id))
    await tx.insert(auditEvents).values({ eventType: "DOCUMENT_REVISION_CREATED", entityType: "DOCUMENT", entityId: document.id, origin: "UNVERIFIED_OPERATOR", context: { revisionId: revision.id, revisionNumber: revision.revisionNumber } })
    return revision
  })
}

export async function transitionDocument(input: unknown) {
  const value = documentTransitionSchema.parse(input)
  const transition = transitionMap[value.transition]
  const db = getDatabase()
  return db.transaction(async (tx) => {
    const [document] = await tx.select().from(documents).where(eq(documents.id, value.documentId))
    if (!document) throw new Error("Document introuvable.")
    if (document.status !== transition.from) throw new Error(`Transition impossible depuis l'état ${document.status}.`)
    const [revision] = await tx.select().from(documentRevisions).where(eq(documentRevisions.id, document.currentRevisionId ?? "00000000-0000-0000-0000-000000000000"))
    if (value.transition === "PUBLISH" && revision?.status !== "APPROVED") throw new Error("Publication impossible : la version courante doit être approuvée.")
    const now = new Date()
    await tx.update(documents).set({ status: transition.to, publishedAt: value.transition === "PUBLISH" ? now : document.publishedAt, archivedAt: value.transition === "ARCHIVE" ? now : document.archivedAt, obsoleteReason: value.transition === "OBSOLETE" ? value.reason : document.obsoleteReason, updatedAt: now }).where(eq(documents.id, document.id))
    if (revision) await tx.update(documentRevisions).set({ status: transition.to === "PUBLISHED" ? "PUBLISHED" : transition.to === "APPROVED" ? "APPROVED" : revision.status, approvedAt: value.transition === "APPROVE" ? now : revision.approvedAt, publishedAt: value.transition === "PUBLISH" ? now : revision.publishedAt, reviewedAt: value.transition === "START_VERIFICATION" ? now : revision.reviewedAt }).where(eq(documentRevisions.id, revision.id))
    await tx.insert(auditEvents).values({ eventType: transition.event, entityType: "DOCUMENT", entityId: document.id, origin: "UNVERIFIED_OPERATOR", context: { from: transition.from, to: transition.to, reason: value.reason } })
    return { id: document.id, status: transition.to }
  })
}

export async function getDocumentDetail(id: string) {
  const db = getDatabase()
  const [document] = await db.select().from(documents).where(eq(documents.id, id))
  if (!document) return null
  const [revisions, events, linkedProcesses, linkedRequirements] = await Promise.all([
    db.select().from(documentRevisions).where(eq(documentRevisions.documentId, id)).orderBy(desc(documentRevisions.revisionNumber)),
    db.select().from(auditEvents).where(and(eq(auditEvents.entityType, "DOCUMENT"), eq(auditEvents.entityId, id))).orderBy(desc(auditEvents.occurredAt)),
    db.select({ id: processes.id, code: processes.code, name: processes.name }).from(documentProcesses).innerJoin(processes, eq(documentProcesses.processId, processes.id)).where(eq(documentProcesses.documentId, id)),
    db.select({ id: requirements.id, code: requirements.code, title: requirements.title }).from(documentRequirements).innerJoin(requirements, eq(documentRequirements.requirementId, requirements.id)).where(eq(documentRequirements.documentId, id)),
  ])
  return { document, revisions, events, linkedProcesses, linkedRequirements }
}
