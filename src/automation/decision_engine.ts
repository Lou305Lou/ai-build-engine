// src/automation/decision_engine.ts

import { AutomationSignal } from "./signal_engine"

export type DecisionAction = "buy" | "sell" | "close" | "ignore"

export interface AutomationDecision {
  symbol: string
  action: DecisionAction
  reason: string

  // Derived metrics
  decisionConfidence: number
  riskScore: number
  executable: boolean
  safetyOverride: boolean

  // Passthrough
  signal: AutomationSignal
  timestamp: number

  // Validation
  valid: boolean
  errors: string[]
}

/**
 * Stage 2 of the automation engine.
 * Converts a signal into a structured decision.
 */
export function computeAutomationDecision(
  signal: AutomationSignal
): AutomationDecision {
  const errors: string[] = []

  // If signal is invalid → propagate failure
  if (!signal.valid) {
    return {
      symbol: signal.symbol,
      action: "ignore",
      reason: "Invalid signal",

      decisionConfidence: 0,
      riskScore: 1,
      executable: false,
      safetyOverride: true,

      signal,
      timestamp: Date.now(),

      valid: false,
      errors: signal.errors
    }
  }

  // -----------------------------
  // DETERMINE ACTION
  // -----------------------------
  let action: DecisionAction = "ignore"
  let reason = "No actionable direction"

  if (signal.direction === "long") {
    action = "buy"
    reason = "Long signal detected"
  }

  if (signal.direction === "short") {
    action = "sell"
    reason = "Short signal detected"
  }

  if (signal.direction === "flat") {
    action = "close"
    reason = "Flat signal detected"
  }

  // -----------------------------
  // DECISION CONFIDENCE
  // -----------------------------
  const decisionConfidence = Math.min(
    1,
    signal.confidence * (signal.volatilityFlag ? 0.7 : 1)
  )

  // -----------------------------
  // RISK SCORE
  // -----------------------------
  // Higher volatility → higher risk
  const riskScore = signal.volatilityFlag ? 0.8 : 0.3

  // -----------------------------
  // SAFETY OVERRIDE
  // -----------------------------
  const safetyOverride = signal.safetyFlag || riskScore > 0.75

  // -----------------------------
  // EXECUTION ELIGIBILITY
  // -----------------------------
  const executable =
    !safetyOverride &&
    decisionConfidence > 0.5 &&
    action !== "ignore"

  return {
    symbol: signal.symbol,
    action,
    reason,

    decisionConfidence,
    riskScore,
    executable,
    safetyOverride,

    signal,
    timestamp: Date.now(),

    valid: true,
    errors
  }
}
