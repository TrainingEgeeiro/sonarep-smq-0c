"use server"

import { and, asc, desc, eq, ilike, isNull, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getDatabase } from "@/lib/db"
import { auditEvents, organizations, processes } from "@/lib/db/schema"
import { processInputSchema, processStatusChangeSchema } from "@/lib/validation"

const idSchema = z.string().uuid()

export type ProcessResult = { ok: true; message: string } | { ok: false; message: string }

export async function listProcesses(query = "") {
  if (!process.env.DATABASE_URL) return { configured: false as const, organizations: [], processes: [] }
  try {
    const db = getDatabase()
    const pattern = `%${query.trim()}%`
    const [organizationRows, processRows] = await Promise.all([
      db.select({ id: organizations.id, name: organizations.name, code: organizations.code }).from(organizations).where(isNull(organizations.deletedAt)).orderBy(asc(organizations.name)),
      db.select({
        id: processes.id, organizationId: processes.organizationId, organizationName: organizations.name,
        code: processes.code, name: processes.name, description: processes.description, category: processes.category,
        ownerReference: processes.ownerReference, status: processes.status, createdAt: processes.createdAt, updatedAt: processes.updatedAt,
      }).from(processes).innerJoin(organizations, eq(processes.organizationId, organizations.id)).where(and(isNull(processes.deletedAt), or(ilike(processes.code, pattern), ilike(processes.name, pattern), ilike(processes.category, pattern)))).orderBy(desc(processes.updatedAt)),
    ])
    return { configured: true as const, organizations: organizationRows, processes: processRows }
  } catch (error) {
    console.error("[processes] list failed", error)
    return { configured: true as const, organizations: [], processes: [], error: "La base PostgreSQL n'est pas disponible." }
  }
}

export async function createProcess(input: unknown): Promise<ProcessResult> {
  const parsed = processInputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." }
  try {
    const db = getDatabase()
    const [created] = await db.insert(processes).values({ ...parsed.data, description: parsed.data.description || null, ownerReference: parsed.data.ownerReference || null }).returning({ id: processes.id })
    await db.insert(auditEvents).values({ eventType: "PROCESS_CREATED", entityType: "PROCESS", entityId: created.id, origin: "UNVERIFIED_OPERATOR", context: { code: parsed.data.code } })
    revalidatePath("/processes")
    return { ok: true, message: "Processus créé et journalisé." }
  } catch (error) {
    console.error("[processes] create failed", error)
    return { ok: false, message: "Création impossible. Vérifiez l'organisation et l'unicité du code." }
  }
}

export async function updateProcess(id: string, input: unknown): Promise<ProcessResult> {
  if (!idSchema.safeParse(id).success) return { ok: false, message: "Identifiant de processus invalide." }
  const parsed = processInputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." }
  try {
    const db = getDatabase()
    const [updated] = await db.update(processes).set({ ...parsed.data, description: parsed.data.description || null, ownerReference: parsed.data.ownerReference || null, updatedAt: new Date() }).where(eq(processes.id, id)).returning({ id: processes.id })
    if (!updated) return { ok: false, message: "Processus introuvable." }
    await db.insert(auditEvents).values({ eventType: "PROCESS_UPDATED", entityType: "PROCESS", entityId: updated.id, origin: "UNVERIFIED_OPERATOR" })
    revalidatePath("/processes")
    return { ok: true, message: "Processus modifié et journalisé." }
  } catch (error) {
    console.error("[processes] update failed", error)
    return { ok: false, message: "Modification impossible. Vérifiez l'unicité du code." }
  }
}

export async function changeProcessStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<ProcessResult> {
  const parsed = processStatusChangeSchema.safeParse({ id, status })
  if (!parsed.success) return { ok: false, message: "Transition de statut invalide." }
  try {
    const db = getDatabase()
    const [updated] = await db.update(processes).set({ status, updatedAt: new Date() }).where(and(eq(processes.id, id), isNull(processes.deletedAt))).returning({ id: processes.id })
    if (!updated) return { ok: false, message: "Processus introuvable." }
    await db.insert(auditEvents).values({ eventType: status === "ACTIVE" ? "PROCESS_REACTIVATED" : "PROCESS_DEACTIVATED", entityType: "PROCESS", entityId: updated.id, origin: "UNVERIFIED_OPERATOR", context: { status } })
    revalidatePath("/processes")
    return { ok: true, message: `Processus ${status === "ACTIVE" ? "activé" : "désactivé"} et journalisé.` }
  } catch (error) {
    console.error("[processes] status failed", error)
    return { ok: false, message: "Changement de statut impossible." }
  }
}

export async function archiveProcess(id: string): Promise<ProcessResult> {
  if (!idSchema.safeParse(id).success) return { ok: false, message: "Identifiant de processus invalide." }
  try {
    const db = getDatabase()
    const [archived] = await db.update(processes).set({ deletedAt: new Date(), status: "INACTIVE", updatedAt: new Date() }).where(and(eq(processes.id, id), isNull(processes.deletedAt))).returning({ id: processes.id })
    if (!archived) return { ok: false, message: "Processus introuvable ou déjà archivé." }
    await db.insert(auditEvents).values({ eventType: "PROCESS_ARCHIVED", entityType: "PROCESS", entityId: archived.id, origin: "UNVERIFIED_OPERATOR" })
    revalidatePath("/processes")
    return { ok: true, message: "Processus archivé et journalisé." }
  } catch (error) {
    console.error("[processes] archive failed", error)
    return { ok: false, message: "Archivage impossible." }
  }
}

export async function getProcess(id: string) {
  if (!idSchema.safeParse(id).success || !process.env.DATABASE_URL) return null
  const db = getDatabase()
  const [row] = await db.select().from(processes).where(and(eq(processes.id, id), isNull(processes.deletedAt))).limit(1)
  return row ?? null
}
