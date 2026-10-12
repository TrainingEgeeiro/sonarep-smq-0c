import { describe, expect, it } from "vitest"
import { causeAnalysisInputSchema, nonconformityInputSchema } from "../../lib/validation"

describe("non-conformités", () => {
  it("refuse une déclaration sans description", () => expect(nonconformityInputSchema.safeParse({ organizationId: "not-uuid", reference: "NC-1" }).success).toBe(false))
  it("exige les éléments factuels de l'analyse des causes", () => expect(causeAnalysisInputSchema.safeParse({ nonconformityId: "not-uuid", method: "5 pourquoi" }).success).toBe(false))
})
