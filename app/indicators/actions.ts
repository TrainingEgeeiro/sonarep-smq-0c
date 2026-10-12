"use server"

import { and, asc, eq, isNull, sql } from "drizzle-orm"
import { getDatabase } from "@/lib/db"
import { auditEvents, indicatorMeasurements, organizations, processes, qualityIndicators } from "@/lib/db/schema"
import { indicatorInputSchema, measurementInputSchema, measurementTransitionSchema } from "@/lib/validation"

export async function getIndicatorWorkspace() {
  try {
    const db = getDatabase()
    const [indicators, measurements, processOptions, organizationOptions] = await Promise.all([
    db.select().from(qualityIndicators).where(isNull(qualityIndicators.deletedAt)).orderBy(asc(qualityIndicators.code)),
    db.select().from(indicatorMeasurements).where(isNull(indicatorMeasurements.deletedAt)).orderBy(asc(indicatorMeasurements.periodStart)),
    db.select({ id: processes.id, code: processes.code, name: processes.name }).from(processes).where(eq(processes.status, "ACTIVE")).orderBy(asc(processes.code)),
    db.select({ id: organizations.id, code: organizations.code, name: organizations.name }).from(organizations).where(isNull(organizations.deletedAt)).orderBy(asc(organizations.code)),
  ])
  const measurementByIndicator = new Map<string, typeof measurements>()
  for (const measurement of measurements) measurementByIndicator.set(measurement.indicatorId, [...(measurementByIndicator.get(measurement.indicatorId) ?? []), measurement])
  const active = indicators.filter((item) => item.status === "ACTIVE").length
  const validated = measurements.filter((item) => item.status === "VALIDATED").length
  const onTarget = measurements.filter((item) => item.status === "VALIDATED").filter((item) => item.targetValue && Number.isFinite(Number(item.observedValue)) && Number.isFinite(Number(item.targetValue))).length
    return { indicators, measurements, measurementByIndicator: Object.fromEntries(measurementByIndicator), processOptions, organizationOptions, metrics: { active, expected: active, realized: measurements.length, validated, onTarget, unavailable: measurements.filter((item) => item.status !== "VALIDATED").length } }
  } catch {
    return { indicators: [], measurements: [], measurementByIndicator: {}, processOptions: [], organizationOptions: [], metrics: { active: 0, expected: 0, realized: 0, validated: 0, onTarget: 0, unavailable: 0 }, unavailableReason: "La migration locale des indicateurs n'est pas encore appliquée à la base cible." }
  }
}

export async function createIndicator(input: unknown) {
  const value = indicatorInputSchema.parse(input)
  const db = getDatabase()
  const [indicator] = await db.insert(qualityIndicators).values(value).returning()
  if (!indicator) throw new Error("Création de l'indicateur impossible.")
  await db.insert(auditEvents).values({ eventType: "INDICATOR_CREATED", entityType: "QUALITY_INDICATOR", entityId: indicator.id, origin: "UNVERIFIED_OPERATOR", context: { code: indicator.code } })
  return indicator
}

export async function createMeasurement(input: unknown) {
  const value = measurementInputSchema.parse(input)
  const db = getDatabase()
  const [measurement] = await db.insert(indicatorMeasurements).values({ ...value, ...(value.status === "SUBMITTED" ? { submittedAt: new Date() } : {}) }).returning()
  if (!measurement) throw new Error("Création de la mesure impossible.")
  await db.insert(auditEvents).values({ eventType: "INDICATOR_MEASUREMENT_CREATED", entityType: "INDICATOR_MEASUREMENT", entityId: measurement.id, origin: "UNVERIFIED_OPERATOR", context: { indicatorId: measurement.indicatorId, periodStart: measurement.periodStart, periodEnd: measurement.periodEnd } })
  return measurement
}

export async function transitionMeasurement(input: unknown) {
  const value = measurementTransitionSchema.parse(input)
  const db = getDatabase()
  const patch = value.status === "SUBMITTED" ? { status: value.status, submittedAt: new Date(), updatedAt: new Date() } : value.status === "VALIDATED" ? { status: value.status, validatedAt: new Date(), updatedAt: new Date() } : { status: value.status, updatedAt: new Date() }
  const [measurement] = await db.update(indicatorMeasurements).set(patch).where(eq(indicatorMeasurements.id, value.id)).returning()
  if (!measurement) throw new Error("Mesure introuvable.")
  await db.insert(auditEvents).values({ eventType: `INDICATOR_MEASUREMENT_${value.status}`, entityType: "INDICATOR_MEASUREMENT", entityId: measurement.id, origin: "UNVERIFIED_OPERATOR", context: { reason: value.reason ?? null } })
  return measurement
}
