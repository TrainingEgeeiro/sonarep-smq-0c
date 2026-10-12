import { describe, expect, it } from "vitest"
import { calculateRatio, interpretMeasurement, parseNumeric } from "./indicator-scoring"

describe("indicator scoring", () => {
  it("refuse les dénominateurs nuls", () => expect(calculateRatio(4, 0)).toBeNull())
  it("interprète une hausse favorable", () => expect(interpretMeasurement("92", "90", "HIGHER_IS_BETTER").status).toBe("ON_TARGET"))
  it("interprète une baisse favorable", () => expect(interpretMeasurement("3", "5", "LOWER_IS_BETTER").status).toBe("ON_TARGET"))
  it("signale une donnée non numérique", () => expect(parseNumeric("indisponible")).toBeNull())
})
