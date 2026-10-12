import { describe, expect, it } from "vitest"
import { riskLevel as level } from "../../lib/risk-scoring"

describe("risk scoring", () => {
  it("keeps initial and residual levels separate", () => {
    expect(level(4)).toBe("LOW")
    expect(level(12)).toBe("HIGH")
    expect(level(20)).toBe("CRITICAL")
    expect(level(25)).not.toBe(level(4))
  })
})
