import { describe, expect, it } from "vitest"
import { auditInputSchema, auditReportInputSchema } from "../../lib/validation"

describe("audit domain validation", () => {
  it("rejects an inverted audit period", () => {
    const result = auditInputSchema.safeParse({ organizationId: "00000000-0000-0000-0000-000000000001", reference: "AUD-1", title: "Audit", type: "INTERNAL", objectives: "Objectifs", scope: "Périmètre", criteria: "Critères", plannedStart: "2026-10-20", plannedEnd: "2026-10-19", processIds: [], requirementIds: [] })
    expect(result.success).toBe(false)
  })

  it("requires complete report fields", () => {
    expect(auditReportInputSchema.safeParse({ auditId: "00000000-0000-0000-0000-000000000001", summary: "Résumé" }).success).toBe(false)
  })
})
