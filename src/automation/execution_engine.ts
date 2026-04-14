// src/automation/execution_engine.ts

import { AutomationRiskAssessment } from "./risk_engine"

export type ExecutionType = "market-buy" | "market-sell" | "close-position" | "ignore"

export interface ExecutionPlan {
  symbol: string
  executionType: ExecutionType
  allowed: boolean
  reason: string

  // Derived metrics
  executionConfidence: number
  executionSafety: number
  blocked: boolean
  blockReasons: string[]

  // Passthrough
  risk: AutomationRiskAssessment
  timestamp: number

  // Validation
  valid: boolean
  errors: string[]
}

/**
 * Stage 4 of the automation engine.
 * Converts a risk assessment into an execution plan.
 */
export function computeExecutionPlan(
  risk: AutomationRiskAssessment
): ExecutionPlan {
  const errors: string[] = []

  // If risk assessment is invalid → propagate failure
  if (!risk.valid) {
    return {
      symbol: risk.symbol,
      executionType: "ignore",
      allowed: false,
      reason: "Invalid risk assessment",

      executionConfidence: 0,
      executionSafety: 0,
      blocked: true,
      blockReasons: ["Invalid risk assessment"],

      risk,
      timestamp: Date.now(),

      valid: false,
      errors: risk.errors
    }
  }

  const blockReasons: string[] = []

  // -----------------------------
  // DETERMINE EXECUTION TYPE
  // -----------------------------
  let executionType: ExecutionType = "ignore"
  let reason = "No valid execution action"

  if (risk.decision.action === "buy") {
    executionType = "market-buy"
    reason = "Buy signal approved"
  }

  if (risk.decision.action === "sell") {
    executionType = "market-sell"
    reason = "Sell signal approved"
  }

  if (risk.decision.action === "close") {
    executionType = "close-position"
    reason = "Close signal approved"
  }

  // -----------------------------
  // EXECUTION CONFIDENCE
  // -----------------------------
  const executionConfidence = Math.max(
    0,
    risk.decision.decisionConfidence * (1 - risk.compositeRiskScore)
  )

  // -----------------------------
  // EXECUTION SAFETY
  // -----------------------------
  const executionSafety = 1 - risk.compositeRiskScore

  // -----------------------------
  // BLOCK CONDITIONS
  // -----------------------------
  if (!risk.allowedToExecute) {
    blockReasons.push("Risk engine blocked execution")
  }

  if (risk.safetyOverride) {
    blockReasons.push("Safety override triggered")
  }

  if (executionConfidence < 0.4) {
    blockReasons.push("Execution confidence too low")
  }

  const blocked = blockReasons.length > 0
  const allowed = !blocked

  return {
    symbol: risk.symbol,
    executionType,
    allowed,
    reason,

    executionConfidence,
    executionSafety,
    blocked,
    blockReasons,

    risk,
    timestamp: Date.now(),

    valid: true,
    errors
  }
}
