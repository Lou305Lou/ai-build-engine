// src/automation/meta/automation_meta_logger.ts

import { AutomationPipelineLogger } from "../logs/pipeline_logger"
import { AutomationHeartbeat } from "./automation_heartbeat"
import { AutomationHealthMonitor } from "./automation_health_monitor"
import { AutomationSafetyReport } from "../safety/safety_meta_engine"
import { AutomationSafetyGateDecision } from "../safety/safety_gatekeeper"

/**
 * Automation Meta-Logger
 *
 * Logs system-level meta events:
 * - heartbeat updates
 * - health reports
 * - safety evaluations
 * - gatekeeper decisions
 * - lifecycle events
 */
export class AutomationMetaLogger {
  private logger: AutomationPipelineLogger
  private heartbeat: AutomationHeartbeat
  private healthMonitor: AutomationHealthMonitor

  constructor(
    heartbeat: AutomationHeartbeat,
    healthMonitor: AutomationHealthMonitor,
    logger?: AutomationPipelineLogger
  ) {
    this.heartbeat = heartbeat
    this.healthMonitor = healthMonitor
    this.logger = logger ?? new AutomationPipelineLogger()
  }

  /**
   * Logs a heartbeat update.
   */
  logHeartbeat() {
    const report = this.heartbeat.getReport()

    this.logger.meta("Heartbeat updated", {
      lastBeat: report.lastBeat,
      ageMs: report.ageMs,
      timeoutMs: report.timeoutMs
    })
  }

  /**
   * Logs a system health report.
   */
  logHealth() {
    const health = this.healthMonitor.getHealth()

    this.logger.meta("System health evaluated", {
      status: health.status,
      lastBeat: health.lastBeat,
      ageMs: health.ageMs,
      timeoutMs: health.timeoutMs
    })
  }

  /**
   * Logs a safety evaluation.
   */
  logSafetyReport(report: AutomationSafetyReport) {
    this.logger.meta("Safety evaluation completed", {
      safe: report.safe,
      issues: report.issues
    })
  }

  /**
   * Logs a gatekeeper decision.
   */
  logGateDecision(decision: AutomationSafetyGateDecision) {
    this.logger.meta("Safety gatekeeper decision", {
      allowed: decision.allowed,
      reason: decision.reason,
      issues: decision.issues
    })
  }

  /**
   * Logs a lifecycle event (start, finish, error, etc.)
   */
  logLifecycle(event: string, data?: any) {
    this.logger.meta(`Lifecycle: ${event}`, data ?? {})
  }
}
