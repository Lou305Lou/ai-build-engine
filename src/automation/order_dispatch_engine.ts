// src/automation/order_dispatch_engine.ts

import { RoutedOrder } from "./order_router"

export interface DispatchPackage {
  symbol: string
  orderType: RoutedOrder["orderType"]
  direction: RoutedOrder["direction"]
  size: number

  // Dispatch target
  target: RoutedOrder["target"]
  executable: boolean
  safe: boolean

  // Dispatch payload (what will be sent to the target)
  payload: any

  // Metadata
  reason: string
  timestamp: number

  // Validation
  valid: boolean
  errors: string[]
}

/**
 * Stage 9 of the automation engine.
 * Converts a routed order into a dispatch-ready package.
 */
export function createDispatchPackage(
  routed: RoutedOrder
): DispatchPackage {
  const errors: string[] = []

  // If routed order is invalid → propagate failure
  if (!routed.valid) {
    return {
      symbol: routed.symbol,
      orderType: "none",
      direction: "flat",
      size: 0,

      target: "blocked",
      executable: false,
      safe: false,

      payload: null,
      reason: "Invalid routed order",
      timestamp: Date.now(),

      valid: false,
      errors: routed.errors
    }
  }

  // -----------------------------
  // BUILD DISPATCH PAYLOAD
  // -----------------------------
  const payload = {
    symbol: routed.symbol,
    orderType: routed.orderType,
    direction: routed.direction,
    size: routed.size,
    routedTarget: routed.target,
    routedReason: routed.reason,
    executionEligible: routed.executable,
    executionSafe: routed.safe,
    upstream: {
      validated: routed.validated,
      risk: routed.validated.order.execution?.risk,
      decision: routed.validated.order.execution?.risk?.decision,
      signal: routed.validated.order.execution?.risk?.decision?.signal
    }
  }

  // -----------------------------
  // FINAL VALIDATION
  // -----------------------------
  const executable = routed.executable
  const safe = routed.safe

  if (!executable) {
    errors.push("Order is not executable")
  }

  if (!safe) {
    errors.push("Order is not safe to execute")
  }

  const valid = errors.length === 0

  return {
    symbol: routed.symbol,
    orderType: routed.orderType,
    direction: routed.direction,
    size: routed.size,

    target: routed.target,
    executable,
    safe,

    payload,

    reason: routed.reason,
    timestamp: Date.now(),

    valid,
    errors
  }
}
