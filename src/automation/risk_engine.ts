// src/automation/risk_engine.ts

import { AutomationDecision } from "./decision_engine"

export type RiskLevel = "low" | "medium" | "high" | "critical"

export interface AutomationRiskAssessment {
  symbol: string

  // Derived risk metrics
  riskLevel: RiskLevel
  compositeRiskScore: number
  volatilityWeight: number
  confidenceWeight: number

  // Execution gating
  allowedToExecute: boolean
  safetyOverride: boolean

  // Passthrough
  decision: AutomationDecision
  timestamp: number

  // Validation
  valid: boolean
  errors: string[]
}

/**
 * Stage 3 of the automation engine.
 * Computes a risk assessment from an automation decision.
 */
export function computeAutomationRisk(
  decision: AutomationDecision
): AutomationRiskAssessment {
  const errors: string[] = []

  // If decision is invalid → propagate failure
  if (!decision.valid) {
    return {
      symbol: decision.symbol,
      riskLevel: "critical",
      compositeRiskScore: 1,
      volatilityWeight: 1,
      confidenceWeight: 0,

      allowedToExecute: false,
      safetyOverride: true,

      decision,
      timestamp: Date.now(),

      valid: false,
      errors: decision.errors
    }
  }

  // -----------------------------
  // VOLATILITY WEIGHT
  // -----------------------------
  const volatilityWeight = decision.signal.volatilityFlag ? 0.8 : 0.3

  // -----------------------------
  // CONFIDENCE WEIGHT
  // -----------------------------
  const confidenceWeight = 1 - decision.decisionConfidence

  // -----------------------------
  // COMPOSITE RISK SCORE
  // -----------------------------
  const compositeRiskScore = Math.min(
    1,
    (volatilityWeight * 0.6) + (confidenceWeight * 0.4)
  )

  // -----------------------------
  // RISK LEVEL CLASSIFICATION
  // -----------------------------
  let riskLevel: RiskLevel = "low"

  if (compositeRiskScore > 0.75) riskLevel = "critical"
  else if (compositeRiskScore > 0.55) riskLevel = "high"
  else if (compositeRiskScore > 0.35) riskLevel = "medium"

  // -----------------------------
  // SAFETY OVERRIDE
  // -----------------------------
  const safetyOverride =
    decision.safetyOverride ||
    compositeRiskScore > 0.75

  // -----------------------------
  // EXECUTION GATING
  // -----------------------------
  const allowedToExecute =
    !safetyOverride &&
    decision.executable &&
    riskLevel !== "critical"

  return {
    symbol: decision.symbol,

    riskLevel,
    compositeRiskScore,
    volatilityWeight,
    confidenceWeight,

    allowedToExecute,
    safetyOverride,

    decision,
    timestamp: Date.now(),

    valid: true,
    errors
  }
}
