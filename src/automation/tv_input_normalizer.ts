// src/automation/tv_input_normalizer.ts

export interface RawTradingViewPayload {
  ticker?: string
  price?: number
  side?: string
  timestamp?: number
  raw?: any
}

export interface NormalizedTVInput {
  symbol: string
  price: number
  direction: "long" | "short" | "flat"
  timestamp: number
  metadata: any
  valid: boolean
  errors: string[]
}

/**
 * Normalize TradingView webhook payload into a strict, validated format.
 */
export function normalizeTradingViewInput(
  payload: RawTradingViewPayload
): NormalizedTVInput {
  const errors: string[] = []

  // Validate symbol
  const symbol =
    typeof payload.ticker === "string" && payload.ticker.trim().length > 0
      ? payload.ticker.trim().toUpperCase()
      : null

  if (!symbol) errors.push("Missing or invalid ticker symbol")

  // Validate price
  const price =
    typeof payload.price === "number" && payload.price > 0
      ? payload.price
      : null

  if (!price) errors.push("Missing or invalid price")

  // Validate direction
  const validSides = ["long", "short", "flat"]
  const direction =
    typeof payload.side === "string" &&
    validSides.includes(payload.side.toLowerCase())
      ? (payload.side.toLowerCase() as "long" | "short" | "flat")
      : null

  if (!direction) errors.push("Missing or invalid side (long | short | flat)")

  // Timestamp
  const timestamp =
    typeof payload.timestamp === "number" && payload.timestamp > 0
      ? payload.timestamp
      : Date.now()

  return {
    symbol: symbol ?? "UNKNOWN",
    price: price ?? 0,
    direction: direction ?? "flat",
    timestamp,
    metadata: payload.raw ?? {},
    valid: errors.length === 0,
    errors
  }
}
