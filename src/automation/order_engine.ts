// src/automation/order_engine.ts

import { ValidatedExecution } from "./execution_validator"

export type OrderType = "market" | "close" | "none"

export interface FinalOrder {
  symbol: string
  orderType: OrderType
  direction: "buy" | "sell" | "flat"
  size: number

  // Derived metrics
  confidence: number
  safety: number
  eligible: boolean
  blocked: boolean
  blockReasons: string[]

  // Passthrough
  execution: ValidatedExecution
  timestamp: number

  // Validation
  valid: boolean
  errors: string[]
}

/**
 * Stage 6 of the automation engine.
 * Converts a validated execution into a final order object.
 */
export function computeFinalOrder(
  execution: ValidatedExecution
): FinalOrder {
  const errors: string[] = []
  const blockReasons: string[] = []

  // If execution is invalid → propagate failure
  if (!execution.valid) {
    return {
      symbol: execution.symbol,
      orderType: "none",
      direction: "flat",
      size: 0,

      confidence: 0,
      safety: 0,
      eligible: false,
      blocked: true,
      blockReasons: ["Invalid execution"],

      execution,
      timestamp: Date.now(),

      valid: false,
      errors: execution.errors
    }
  }

  // -----------------------------
  // DETERMINE ORDER TYPE + DIRECTION
  // -----------------------------
  let orderType: OrderType = "none"
  let direction: "buy" | "sell" | "flat" = "flat"

  if (execution.executionType === "market-buy") {
    orderType = "market"
    direction = "buy"
  }

  if (execution.executionType === "market-sell") {
    orderType = "market"
    direction = "sell"
  }

  if (execution.executionType === "close-position") {
    orderType = "close"
    direction = "flat"
  }

  // -----------------------------
  // CONFIDENCE & SAFETY
  // -----------------------------
  const confidence = execution.finalConfidence
  const safety = execution.finalSafety

  // -----------------------------
  // BLOCK CONDITIONS
  // -----------------------------
  if (!execution.approved) {
    blockReasons.push("Execution not approved")
  }

  if (confidence < 0.5) {
    blockReasons.push("Order confidence too low")
  }

  if (safety < 0.5) {
    blockReasons.push("Order safety too low")
  }

  const blocked = blockReasons.length > 0
  const eligible = !blocked && orderType !== "none"

  // -----------------------------
  // ORDER SIZE (placeholder)
  // -----------------------------
  // Later chunks will compute dynamic sizing.
  const size = eligible ? 1 : 0

  return {
    symbol: execution.symbol,
    orderType,
    direction,
    size,

    confidence,
    safety,
    eligible,
    blocked,
    blockReasons,

    execution,
    timestamp: Date.now(),

    valid: true,
    errors
  }
}
