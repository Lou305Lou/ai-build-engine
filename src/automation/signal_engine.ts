// src/automation/signal_engine.ts

import { NormalizedTVInput } from "./tv_input_normalizer"

export interface AutomationSignal {
  symbol: string
  direction: "long" | "short" | "flat"
  price: number
  timestamp: number

  // Derived signal properties
  strength: number
  confidence: number
  volatilityFlag: boolean
  safetyFlag: boolean

  // Raw metadata passthrough
  metadata: any

  // Validation
  valid: boolean
  errors: string[]
}

/**
 * Compute a basic signal from normalized TradingView input.
 * This is Stage 1 of the automation engine.
 */
export function computeAutomationSignal(
  input: NormalizedTVInput
): AutomationSignal {
  const errors: string[] = []

  // If the input is invalid, propagate errors immediately
  if (!input.valid) {
    return {
      symbol: input.symbol,
      direction: input.direction,
      price: input.price,
      timestamp: input.timestamp,

      strength: 0,
      confidence: 0,
      volatilityFlag: false,
      safetyFlag: true, // auto-safe on invalid input

      metadata: input.metadata,
      valid: false,
      errors: input.errors
    }
  }

  // -----------------------------
  // SIGNAL STRENGTH CALCULATION
  // -----------------------------
  let strength = 0

  if (input.direction === "long") strength = 1
  if (input.direction === "short") strength = -1
  if (input.direction === "flat") strength = 0

  // -----------------------------
  // CONFIDENCE BASELINE
  // -----------------------------
  // Simple baseline for now — later chunks will expand this
  const confidence = Math.abs(strength) > 0 ? 0.65 : 0.25

  // -----------------------------
  // VOLATILITY FLAG
  // -----------------------------
  // If metadata contains volatility info, use it
  const volatilityFlag =
    typeof input.metadata?.volatility === "number" &&
    input.metadata.volatility > 0.7

  // -----------------------------
  // SAFETY FLAG
  // -----------------------------
  // If volatility is high OR confidence is low → safety flag
  const safetyFlag = volatilityFlag || confidence < 0.4

  return {
    symbol: input.symbol,
    direction: input.direction,
    price: input.price,
    timestamp: input.timestamp,

    strength,
    confidence,
    volatilityFlag,
    safetyFlag,

    metadata: input.metadata,
    valid: true,
    errors
  }
}
