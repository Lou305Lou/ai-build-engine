// src/automation/execution_validator.ts

import { ExecutionPlan } from "./execution_engine"

export interface ValidatedExecution {
  symbol: string
  executionType: ExecutionPlan["executionType"]
  approved: boolean
  reason: string

  // Derived validation metrics
  finalConfidence: number
  finalSafety: number
  stale: boolean
  contradictory: boolean

  // Passthrough
  plan: ExecutionPlan
  timestamp: number

  // Validation
  valid: boolean
  errors: string[]
}

/**
 * Stage 5 of the automation engine.
 * Validates an execution plan before it is allowed to reach the order engine.
 */
export function validateExecutionPlan(
  plan: ExecutionPlan
): ValidatedExecution {
  const errors: string[] = []

  // If plan is invalid → propagate failure
  if (!plan.valid) {
    return {
      symbol: plan.symbol,
      executionType: "ignore",
      approved: false,
      reason: "Invalid execution plan",

      finalConfidence: 0,
      finalSafety: 0,
      stale: false,
      contradictory: false,

      plan,
      timestamp: Date.now(),

      valid: false,
      errors: plan.errors
    }
  }

  // -----------------------------
  // STALE CHECK
  // -----------------------------
  const now = Date.now()
  const ageMs = now - plan.timestamp
  const stale = ageMs > 10_000 // 10 seconds max age

  if (stale) {
    errors.push("Execution plan is stale")
  }

  // -----------------------------
  // CONTRADICTION CHECK
  // -----------------------------
  let contradictory = false

  if (plan.executionType === "market-buy" && plan.risk.decision.action !== "buy") {
    contradictory = true
    errors.push("Execution type contradicts decision action")
  }

  if (plan.executionType === "market-sell" && plan.risk.decision.action !== "sell") {
    contradictory = true
    errors.push("Execution type contradicts decision action")
  }

  if (plan.executionType === "close-position" && plan.risk.decision.action !== "close") {
    contradictory = true
    errors.push("Execution type contradicts decision action")
  }

  // -----------------------------
  // FINAL CONFIDENCE & SAFETY
  // -----------------------------
  const finalConfidence = Math.max(0, plan.executionConfidence - (stale ? 0.3 : 0))
  const finalSafety = Math.max(0, plan.executionSafety - (contradictory ? 0.5 : 0))

  // -----------------------------
  // FINAL APPROVAL
  // -----------------------------
  const approved =
    errors.length === 0 &&
    plan.allowed &&
    finalConfidence > 0.5 &&
    finalSafety > 0.5

  const reason =
    approved
      ? "Execution approved"
      : errors.length > 0
        ? errors.join("; ")
        : "Execution blocked by validation rules"

  return {
    symbol: plan.symbol,
    executionType: plan.executionType,
    approved,
    reason,

    finalConfidence,
    finalSafety,
    stale,
    contradictory,

    plan,
    timestamp: now,

    valid: errors.length === 0,
    errors
  }
}
