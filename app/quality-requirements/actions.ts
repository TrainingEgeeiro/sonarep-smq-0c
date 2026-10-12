"use server"

import { and, asc, desc, eq, ilike, isNull, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getDatabase } from "@/lib/db"
import { auditEvents, organizations, requirementAssessments, requirementProcesses, requirementSources, requirements, processes } from "@/lib/db/schema"
import { assessmentInputSchema, requirementInputSchema } from "@/lib/validation"

export async function listQualityRequirements(query = "") {
  if (!process.env.DATABASE_URL) return { configured: false as const, requirements: [], sources: [], organizations: [], processes: [], metrics: null }
  try {
    const db = getDatabase(); const pattern = `%${query.trim()}%`
    const [rows, sources, organizationsRows, processesRows, metricRows] = await Promise.all([
      db.select({ id: requirements.id, code: requirements.code, title: requirements.title, category: requirements.category, domain: requirements.domain, status: requirements.status, applicability: requirements.applicability, sourceName: requirementSources.name, organizationName: organizations.name, lastEvaluatedAt: requirements.lastEvaluatedAt }).from(requirements).innerJoin(requirementSources, eq(requirements.sourceId, requirementSources.id)).innerJoin(organizations, eq(requirements.organizationId, organizations.id)).where(and(isNull(requirements.deletedAt), sql`(${ilike(requirements.code, pattern)} OR ${ilike(requirements.title, pattern)} OR ${ilike(requirementSources.name, pattern)})`)).orderBy(desc(requirements.updatedAt)),
      db.select({ id: requirementSources.id, name: requirementSources.name, code: requirementSources.code }).from(requirementSources).where(isNull(requirementSources.deletedAt)).orderBy(asc(requirementSources.name)),
      db.select({ id: organizations.id, name: organizations.name }).from(organizations).where(isNull(organizations.deletedAt)).orderBy(asc(organizations.name)),
      db.select({ id: processes.id, code: processes.code, name: processes.name }).from(processes).where(and(isNull(processes.deletedAt), eq(processes.status, "ACTIVE"))).orderBy(asc(processes.code)),
      db.select({ status: requirements.status, count: sql<number>`count(*)::int` }).from(requirements).where(isNull(requirements.deletedAt)).groupBy(requirements.status),
    ])
    return { configured: true as const, requirements: rows, sources, organizations: organizationsRows, processes: processesRows, metrics: Object.fromEntries(metricRows.map((row) => [row.status, row.count])) }
  } catch (error) { console.error("[quality-requirements] list failed", error); return { configured: true as const, requirements: [], sources: [], organizations: [], processes: [], metrics: null, error: "La base PostgreSQL n'est pas disponible." } }
}

export async function createRequirement(input: unknown) {
  const parsed = requirementInputSchema.safeParse(input); if (!parsed.success) return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Données invalides." }
  try { const db = getDatabase(); const [created] = await db.insert(requirements).values({ ...parsed.data, description: parsed.data.description || null, referenceClause: parsed.data.referenceClause || null, domain: parsed.data.domain || null, justification: parsed.data.justification || null }).returning({ id: requirements.id }); await db.insert(auditEvents).values({ eventType: "REQUIREMENT_CREATED", entityType: "REQUIREMENT", entityId: created.id, origin: "UNVERIFIED_OPERATOR", context: { code: parsed.data.code } }); revalidatePath("/quality-requirements"); return { ok: true as const, message: "Exigence créée et journalisée." } } catch { return { ok: false as const, message: "Création impossible. Vérifiez les références et l'unicité du code." } }
}

export async function assessRequirement(input: unknown) {
  const parsed = assessmentInputSchema.safeParse(input); if (!parsed.success) return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Évaluation invalide." }
  try { const db = getDatabase(); const [requirement] = await db.select({ id: requirements.id }).from(requirements).where(and(eq(requirements.id, parsed.data.requirementId), isNull(requirements.deletedAt))).limit(1); if (!requirement) return { ok: false as const, message: "Exigence introuvable." }; await db.transaction(async (tx) => { await tx.insert(requirementAssessments).values({ ...parsed.data, justification: parsed.data.justification || null, scopeReference: parsed.data.scopeReference || null }); await tx.update(requirements).set({ status: parsed.data.status, justification: parsed.data.justification || null, lastEvaluatedAt: new Date(), updatedAt: new Date() }).where(eq(requirements.id, parsed.data.requirementId)); await tx.insert(auditEvents).values({ eventType: "REQUIREMENT_ASSESSED", entityType: "REQUIREMENT", entityId: parsed.data.requirementId, origin: "UNVERIFIED_OPERATOR", context: { status: parsed.data.status } }) }); revalidatePath("/quality-requirements"); return { ok: true as const, message: "Évaluation enregistrée et historisée." } } catch { return { ok: false as const, message: "Évaluation impossible." } }
}

export async function archiveRequirement(id: string) { try { const db = getDatabase(); const [row] = await db.update(requirements).set({ deletedAt: new Date(), updatedAt: new Date() }).where(and(eq(requirements.id, id), isNull(requirements.deletedAt))).returning({ id: requirements.id }); if (!row) return { ok: false as const, message: "Exigence introuvable." }; await db.insert(auditEvents).values({ eventType: "REQUIREMENT_ARCHIVED", entityType: "REQUIREMENT", entityId: row.id, origin: "UNVERIFIED_OPERATOR" }); revalidatePath("/quality-requirements"); return { ok: true as const, message: "Exigence archivée." } } catch { return { ok: false as const, message: "Archivage impossible." } } }

export async function linkRequirementToProcess(requirementId: string, processId: string) { try { const db = getDatabase(); await db.insert(requirementProcesses).values({ requirementId, processId }); await db.insert(auditEvents).values({ eventType: "REQUIREMENT_PROCESS_LINKED", entityType: "REQUIREMENT", entityId: requirementId, origin: "UNVERIFIED_OPERATOR", context: { processId } }); revalidatePath("/quality-requirements"); return { ok: true as const, message: "Rattachement enregistré." } } catch { return { ok: false as const, message: "Rattachement impossible ou déjà existant." } } }

export async function getRequirementHistory(requirementId: string) { if (!process.env.DATABASE_URL) return []; const db = getDatabase(); return db.select().from(requirementAssessments).where(eq(requirementAssessments.requirementId, requirementId)).orderBy(desc(requirementAssessments.evaluatedAt)) }

export async function getRequirementDetail(id: string) { if (!process.env.DATABASE_URL) return null; const db = getDatabase(); const [row] = await db.select().from(requirements).where(and(eq(requirements.id, id), isNull(requirements.deletedAt))).limit(1); return row ?? null }

export type QualityRequirementList = Awaited<ReturnType<typeof listQualityRequirements>>

export type RequirementActionResult = { ok: true; message: string } | { ok: false; message: string }
