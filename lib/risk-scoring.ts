export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export function riskLevel(score: number): RiskLevel {
  return score >= 20 ? "CRITICAL" : score >= 12 ? "HIGH" : score >= 6 ? "MEDIUM" : "LOW"
}
