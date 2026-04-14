// src/automation/order_router.ts

import { ValidatedOrder } from "./order_validator"

export type RouteTarget =
  | "live-broker"
  | "simulator"
  | "dashboard"
  | "terminal"
  | "qwen"
  | "log-only"
  | "blocked"

export interface RoutedOrder {
  symbol: string
  orderType: ValidatedOrder["orderType"]
  direction: ValidatedOrder["direction"]
  size: number

  // Routing
  target: RouteTarget
  reason: string

  // Derived metrics
  executable: boolean
  safe: boolean

  // Passthrough
  validated: ValidatedOrder
  timestamp: number

  // Validation
  valid: boolean
  errors: string[]
}

/**
 * Stage 8 of the automation engine.
 * Determines where the order should be routed.
 */
export function routeOrder(validated: ValidatedOrder): RoutedOrder {
  const errors: string[] = []

  // If validated order is invalid → propagate failure
  if (!validated.valid) {
    return {
      symbol: validated.symbol,
      orderType: "none",
      direction: "flat",
      size: 0,

      target: "blocked",
      reason: "Invalid validated order",

      executable: false,
      safe: false,

      validated,
      timestamp: Date.now(),

      valid: false,
      errors: validated.errors
    }
  }

  // -----------------------------
  // DETERMINE ROUTING TARGET
  // -----------------------------
  let target: RouteTarget = "log-only"
  let reason = "Default routing to log-only"

  // If order is not approved → block
  if (!validated.approved) {
    target = "blocked"
    reason = "Order not approved"
  }

  // If order is approved but small → simulator
  else if (validated.size <= 1) {
    target = "simulator"
    reason = "Small order routed to simulator"
  }

  // If order is approved and safe → live broker
  else if (validated.finalSafety > 0.7 && validated.finalConfidence > 0.7) {
    target = "live-broker"
    reason = "High-confidence, high-safety order routed to live broker"
  }

  // If order is approved but medium confidence → dashboard + terminal
  else if (validated.finalConfidence > 0.5) {
    target = "dashboard"
    reason = "Medium-confidence order routed to dashboard"
  }

  // If order is borderline → terminal for manual review
  else if (validated.finalConfidence > 0.3) {
    target = "terminal"
    reason = "Low-confidence order routed to terminal for manual review"
  }

  // If order is very low confidence → Qwen reasoning
  else {
    target = "qwen"
    reason = "Order requires Qwen reasoning chain"
  }

  // -----------------------------
  // EXECUTION + SAFETY FLAGS
  // -----------------------------
  const executable = target === "live-broker" || target === "simulator"
  const safe = validated.finalSafety > 0.5

  return {
    symbol: validated.symbol,
    orderType: validated.orderType,
    direction: validated.direction,
    size: validated.size,

    target,
    reason,

    executable,
    safe,

    validated,
    timestamp: Date.now(),

    valid: true,
    errors
  }
}
