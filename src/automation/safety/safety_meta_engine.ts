// src/automation/safety/safety_meta_engine.ts

import { FullAutomationResult } from "../automation_orchestrator"

export interface AutomationSafetyIssue {
  level: "info" | "warning" | "error"
  message: string
  field?: string
}

export interface AutomationSafetyReport {
  safe: boolean
  issues: AutomationSafetyIssue[]
  timestamp: number
}

/**
 * Automation Safety Meta-Engine (Evaluator Only)
 * 
 * This engine inspects the full automation pipeline output and
 * generates a structured safety report. It does NOT block execution.
 */
export class SafetyMetaEngine {
  evaluate(result: FullAutomationResult): AutomationSafetyReport {
    const issues: AutomationSafetyIssue[] = []

    // --- Signal sanity ---
    if (!result.signal) {
      issues.push({
        level: "error",
        message: "Missing signal object",
        field: "signal"
      })
    }

    // --- Decision sanity ---
    if (!result.decision) {
      issues.push({
        level: "error",
        message: "Missing decision object",
        field: "decision"
      })
    }

    // --- Risk sanity ---
    if (!result.risk) {
      issues.push({
        level: "warning",
        message: "Risk module returned no data",
        field: "risk"
      })
    }

    // --- Execution plan sanity ---
    if (!result.executionPlan) {
      issues.push({
        level: "error",
        message: "Missing execution plan",
        field: "executionPlan"
      })
    }

    // --- Final order sanity ---
    if (!result.finalOrder) {
      issues.push({
        level: "error",
        message: "Missing final order",
        field: "finalOrder"
      })
    } else {
      if (result.finalOrder.quantity <= 0) {
        issues.push({
          level: "error",
          message: "Final order quantity must be greater than zero",
          field: "finalOrder.quantity"
        })
      }

      if (!["buy", "sell"].includes(result.finalOrder.side)) {
        issues.push({
          level: "error",
          message: "Final order side must be 'buy' or 'sell'",
          field: "finalOrder.side"
        })
      }
    }

    // --- Dispatch sanity ---
    if (!result.dispatch) {
      issues.push({
        level: "warning",
        message: "Dispatch package missing",
        field: "dispatch"
      })
    }

    return {
      safe: issues.every(i => i.level !== "error"),
      issues,
      timestamp: Date.now()
    }
  }
}
