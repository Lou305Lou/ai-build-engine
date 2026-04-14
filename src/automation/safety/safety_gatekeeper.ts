// src/automation/safety/safety_gatekeeper.ts

import { AutomationSafetyReport } from "./safety_meta_engine"

export interface AutomationSafetyGateDecision {
  allowed: boolean
  reason?: string
  issues: AutomationSafetyReport["issues"]
  timestamp: number
}

/**
 * Safety Gatekeeper
 * 
 * This module enforces safety rules based on the safety report.
 * If any "error" level issues exist, execution is blocked.
 */
export class SafetyGatekeeper {
  enforce(report: AutomationSafetyReport): AutomationSafetyGateDecision {
    const hasErrors = report.issues.some(i => i.level === "error")

    if (hasErrors) {
      return {
        allowed: false,
        reason: "Safety violations detected",
        issues: report.issues,
        timestamp: Date.now()
      }
    }

    return {
      allowed: true,
      issues: report.issues,
      timestamp: Date.now()
    }
  }
}
