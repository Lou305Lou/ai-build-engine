// src/automation/order_validator.ts

import { FinalOrder } from "./order_engine"

export interface ValidatedOrder {
  symbol: string
  orderType: FinalOrder["orderType"]
  direction: FinalOrder["direction"]
  size: number

  approved: boolean
  reason: string

  // Derived validation metrics
  finalConfidence: number
  finalSafety: number
  stale: boolean
  contradictory: boolean

  // Passthrough
  order: FinalOrder
  timestamp: number

  // Validation
  valid: boolean
  errors: string[]
}

/**
 * Stage 7 of the automation engine.
 * Validates a final order before it is allowed to reach the order router.
 */
export function validateFinalOrder(order: FinalOrder): ValidatedOrder {
  const errors: string[] = []

  // If order is invalid → propagate failure
  if (!order.valid) {
    return {
      symbol: order.symbol,
      orderType: "none",
      direction: "flat",
      size: 0,

      approved: false,
      reason: "Invalid order",

      finalConfidence: 0,
      finalSafety: 0,
      stale: false,
      contradictory: false,

      order,
      timestamp: Date.now(),

      valid: false,
      errors: order.errors
    }
  }

  // -----------------------------
  // STALE CHECK
  // -----------------------------
  const now = Date.now()
  const ageMs = now - order.timestamp
  const stale = ageMs > 10_000 // 10 seconds max age

  if (stale) {
    errors.push("Order is stale")
  }

  // -----------------------------
  // CONTRADICTION CHECK
  // -----------------------------
  let contradictory = false

  if (order.orderType === "market" && order.direction === "flat") {
    contradictory = true
    errors.push("Market order cannot have flat direction")
  }

  if (order.orderType === "close" && order.direction !== "flat") {
    contradictory = true
    errors.push("Close order must have flat direction")
  }

  // -----------------------------
  // FINAL CONFIDENCE & SAFETY
  // -----------------------------
  const finalConfidence = Math.max(0, order.confidence - (stale ? 0.3 : 0))
  const finalSafety = Math.max(0, order.safety - (contradictory ? 0.5 : 0))

  // -----------------------------
  // FINAL APPROVAL
  // -----------------------------
  const approved =
    errors.length === 0 &&
    order.eligible &&
    finalConfidence > 0.5 &&
    finalSafety > 0.5 &&
    order.size > 0

  const reason =
    approved
      ? "Order approved"
      : errors.length > 0
        ? errors.join("; ")
        : "Order blocked by validation rules"

  return {
    symbol: order.symbol,
    orderType: order.orderType,
    direction: order.direction,
    size: order.size,

    approved,
    reason,

    finalConfidence,
    finalSafety,
    stale,
    contradictory,

    order,
    timestamp: now,

    valid: errors.length === 0,
    errors
  }
}
