"use server"

import { and, asc, desc, eq, ilike, isNull, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getDatabase } from "@/lib/db"
import { auditEvents, organizations, processes, requirements, risks, riskAssessments, riskDocuments, riskRequirements, documents } from "@/lib/db/schema"
import { riskInputSchema, riskStatusChangeSchema } from "@/lib/validation"
import { riskLevel as level } from "@/lib/risk-scoring"
const idOk = (value: string) => /^[0-9a-f-]{36}$/i.test(value)
export type RiskResult = { ok: true; message: string } | { ok: false; message: string }

export async function listRisks(query = "") {
  if (!process.env.DATABASE_URL && !process.env.SUPABASE_POSTGRES_URL) return { configured: false as const, risks: [], processes: [], organizations: [], requirements: [], documents: [] }
  try { const db = getDatabase(); const pattern = `%${query.trim()}%`; const [rows, processRows, organizationRows, requirementRows, documentRows] = await Promise.all([
    db.select({ id: risks.id, code: risks.code, title: risks.title, kind: risks.kind, category: risks.category, source: risks.source, status: risks.status, initialScore: risks.initialScore, initialLevel: risks.initialLevel, residualScore: risks.residualScore, residualLevel: risks.residualLevel, treatmentDueOn: risks.treatmentDueOn, processName: processes.name }).from(risks).leftJoin(processes, eq(risks.processId, processes.id)).where(and(isNull(risks.deletedAt), sql`(${ilike(risks.code, pattern)} or ${ilike(risks.title, pattern)} or ${ilike(risks.category, pattern)})`)).orderBy(desc(risks.updatedAt)),
    db.select({ id: processes.id, code: processes.code, name: processes.name }).from(processes).where(and(isNull(processes.deletedAt), eq(processes.status, "ACTIVE"))).orderBy(asc(processes.code)),
    db.select({ id: organizations.id, code: organizations.code, name: organizations.name }).from(organizations).where(isNull(organizations.deletedAt)).orderBy(asc(organizations.code)),
    db.select({ id: requirements.id, code: requirements.code, title: requirements.title }).from(requirements).where(isNull(requirements.deletedAt)).orderBy(asc(requirements.code)),
    db.select({ id: documents.id, code: documents.code, title: documents.title }).from(documents).where(isNull(documents.deletedAt)).orderBy(asc(documents.code)),
  ]); return { configured: true as const, risks: rows, processes: processRows, organizations: organizationRows, requirements: requirementRows, documents: documentRows }
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    const migrationPending = /(?:relation|table|column).*?(?:risks|processes|organizations|requirements|documents).*?(?:does not exist|missing)/i.test(message)
    return { configured: true as const, risks: [], processes: [], organizations: [], requirements: [], documents: [], error: migrationPending ? "Le registre des risques est prêt, mais sa migration de base n'est pas encore appliquée." : "La base PostgreSQL n'est pas disponible." }
  }
}

export async function createRisk(input: unknown): Promise<RiskResult> {
  const parsed = riskInputSchema.safeParse(input); if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." }
  const value = parsed.data; const initialScore = value.initial.probability * value.initial.impact; const residualScore = value.residual ? value.residual.probability * value.residual.impact : null
  try { const db = getDatabase(); await db.transaction(async (tx) => { const [org] = await tx.select({ id: organizations.id }).from(organizations).where(and(eq(organizations.id, value.organizationId), isNull(organizations.deletedAt))).limit(1); if (!org) throw new Error("ORG_NOT_FOUND"); if (value.processId) { const [process] = await tx.select({ id: processes.id }).from(processes).where(and(eq(processes.id, value.processId), eq(processes.organizationId, value.organizationId), isNull(processes.deletedAt))).limit(1); if (!process) throw new Error("PROCESS_MISMATCH") }
    const [risk] = await tx.insert(risks).values({ organizationId: value.organizationId, processId: value.processId, kind: value.kind, code: value.code, title: value.title, category: value.category, source: value.source, description: value.description, consequences: value.consequences, causes: value.causes, existingControls: value.existingControls, treatmentPlan: value.treatmentPlan, ownerReference: value.ownerReference, treatmentDueOn: value.treatmentDueOn, status: value.status, initialProbability: value.initial.probability, initialImpact: value.initial.impact, initialScore, initialLevel: level(initialScore), residualProbability: value.residual?.probability, residualImpact: value.residual?.impact, residualScore, residualLevel: residualScore ? level(residualScore) : null }).returning({ id: risks.id });
    await tx.insert(riskAssessments).values([{ riskId: risk.id, assessmentType: "INITIAL", probability: value.initial.probability, impact: value.initial.impact, score: initialScore, level: level(initialScore), rationale: value.initial.rationale }, ...(value.residual ? [{ riskId: risk.id, assessmentType: "RESIDUAL" as const, probability: value.residual.probability, impact: value.residual.impact, score: residualScore!, level: level(residualScore!), rationale: value.residual.rationale }] : [])]); if (value.requirementIds.length) await tx.insert(riskRequirements).values(value.requirementIds.map(requirementId => ({ riskId: risk.id, requirementId }))); if (value.documentIds.length) await tx.insert(riskDocuments).values(value.documentIds.map(documentId => ({ riskId: risk.id, documentId }))); await tx.insert(auditEvents).values({ eventType: "RISK_CREATED", entityType: "RISK", entityId: risk.id, origin: "UNVERIFIED_OPERATOR", context: { code: value.code, initialScore, residualScore } }) }); revalidatePath("/risks"); return { ok: true, message: "Risque/opportunité créé et journalisé." } } catch (error) { console.error("[risks] create failed", error); return { ok: false, message: error instanceof Error && error.message === "PROCESS_MISMATCH" ? "Le processus ne correspond pas à l'organisation." : error instanceof Error && error.message === "ORG_NOT_FOUND" ? "Organisation introuvable." : "Création impossible. Vérifiez l'unicité du code." } }
}

export async function changeRiskStatus(input: unknown): Promise<RiskResult> { const parsed = riskStatusChangeSchema.safeParse(input); if (!parsed.success || !idOk(parsed.data.id)) return { ok: false, message: "Transition invalide." }; const allowed: Record<string, string[]> = { IDENTIFIED: ["ASSESSED", "ACCEPTED"], ASSESSED: ["TREATMENT_PLANNED", "ACCEPTED"], TREATMENT_PLANNED: ["IN_TREATMENT", "CLOSED"], IN_TREATMENT: ["MONITORED", "CLOSED"], MONITORED: ["IN_TREATMENT", "CLOSED"], ACCEPTED: ["MONITORED", "CLOSED"], CLOSED: [] }; try { const db = getDatabase(); const [current] = await db.select({ status: risks.status }).from(risks).where(and(eq(risks.id, parsed.data.id), isNull(risks.deletedAt))); if (!current || !allowed[current.status].includes(parsed.data.status)) return { ok: false, message: "Cette transition de statut n'est pas autorisée." }; await db.transaction(async tx => { await tx.update(risks).set({ status: parsed.data.status, updatedAt: new Date() }).where(eq(risks.id, parsed.data.id)); await tx.insert(auditEvents).values({ eventType: "RISK_STATUS_CHANGED", entityType: "RISK", entityId: parsed.data.id, origin: "UNVERIFIED_OPERATOR", context: { from: current.status, to: parsed.data.status, reason: parsed.data.reason } }) }); revalidatePath("/risks"); return { ok: true, message: "Statut modifié et journalisé." } } catch { return { ok: false, message: "Transition impossible." } } }

export async function getRiskHistory(id: string) { if (!idOk(id)) return []; try { return await getDatabase().select().from(riskAssessments).where(eq(riskAssessments.riskId, id)).orderBy(desc(riskAssessments.assessedAt)) } catch { return [] } }

export { level }
