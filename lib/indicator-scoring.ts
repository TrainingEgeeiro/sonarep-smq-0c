export type IndicatorDirection = "HIGHER_IS_BETTER" | "LOWER_IS_BETTER" | "TARGET_RANGE"

export function parseNumeric(value: string | null | undefined) {
  if (value == null || value.trim() === "") return null
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) ? parsed : null
}

export function interpretMeasurement(observed: string, target: string | null | undefined, direction: IndicatorDirection) {
  const observedNumber = parseNumeric(observed)
  const targetNumber = parseNumeric(target)
  if (observedNumber === null || targetNumber === null) return { status: "UNAVAILABLE" as const, gap: null }
  const gap = observedNumber - targetNumber
  const conforming = direction === "HIGHER_IS_BETTER" ? observedNumber >= targetNumber : direction === "LOWER_IS_BETTER" ? observedNumber <= targetNumber : observedNumber === targetNumber
  return { status: conforming ? "ON_TARGET" as const : "ALERT" as const, gap }
}

export function calculateRatio(numerator: number, denominator: number) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null
  return numerator / denominator
}
