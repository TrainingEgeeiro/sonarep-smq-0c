import { describe, expect, it } from "vitest"
import { documentInputSchema, requirementInputSchema } from "./validation"

describe("QMS validation rules", () => {
  it("requires a justification for non-applicable requirements", () => {
    expect(requirementInputSchema.safeParse({ code: "R-1", title: "Test", status: "NOT_APPLICABLE" }).success).toBe(false)
    expect(requirementInputSchema.safeParse({ code: "R-1", title: "Test", status: "NOT_APPLICABLE", justification: "Hors périmètre" }).success).toBe(true)
  })

  it("requires an obsolescence reason", () => {
    expect(documentInputSchema.safeParse({ code: "DOC-1", title: "Test", status: "OBSOLETE" }).success).toBe(false)
    expect(documentInputSchema.safeParse({ code: "DOC-1", title: "Test", status: "OBSOLETE", obsoleteReason: "Remplacé" }).success).toBe(true)
  })
})
