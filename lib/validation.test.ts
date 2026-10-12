import { describe, expect, it } from "vitest"
import { documentInputSchema, processInputSchema, processStatusChangeSchema, requirementInputSchema } from "./validation"

describe("QMS validation rules", () => {
  it("requires a justification for non-applicable requirements", () => {
    expect(requirementInputSchema.safeParse({ code: "R-1", title: "Test", status: "NOT_APPLICABLE" }).success).toBe(false)
    expect(requirementInputSchema.safeParse({ code: "R-1", title: "Test", status: "NOT_APPLICABLE", justification: "Hors périmètre" }).success).toBe(true)
  })

  it("requires an obsolescence reason", () => {
    expect(documentInputSchema.safeParse({ code: "DOC-1", title: "Test", status: "OBSOLETE" }).success).toBe(false)
    expect(documentInputSchema.safeParse({ code: "DOC-1", title: "Test", status: "OBSOLETE", obsoleteReason: "Remplacé" }).success).toBe(true)
  })

  it("validates process fields and status transitions", () => {
    const valid = { organizationId: "550e8400-e29b-41d4-a716-446655440000", code: "PR-01", name: "Piloter la qualité", category: "Management" }
    expect(processInputSchema.safeParse(valid).success).toBe(true)
    expect(processInputSchema.safeParse({ ...valid, name: "" }).success).toBe(false)
    expect(processStatusChangeSchema.safeParse({ id: valid.organizationId, status: "INACTIVE" }).success).toBe(true)
    expect(processStatusChangeSchema.safeParse({ id: valid.organizationId, status: "UNKNOWN" }).success).toBe(false)
  })
})
