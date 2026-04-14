// src/automation/meta/automation_health_monitor.ts

import { AutomationHeartbeat } from "./automation_heartbeat"

export interface AutomationHealthReport {
  status: "healthy" | "degraded" | "dead"
  lastBeat: number
  ageMs: number
  timeoutMs: number
  timestamp: number
}

/**
 * Automation Health Monitor
 *
 * Evaluates the system's health based on the heartbeat.
 * Used by dashboards, terminal UI, and the meta-logger.
 */
export class AutomationHealthMonitor {
  private heartbeat: AutomationHeartbeat
  private degradedThresholdMs: number

  constructor(
    heartbeat: AutomationHeartbeat,
    degradedThresholdMs: number = 1000 * 60 * 2 // 2 minutes
  ) {
    this.heartbeat = heartbeat
    this.degradedThresholdMs = degradedThresholdMs
  }

  /**
   * Returns a structured health report.
   */
  getHealth(): AutomationHealthReport {
    const lastBeat = this.heartbeat.getLastBeat()
    const ageMs = Date.now() - lastBeat
    const timeoutMs = this.heartbeat.getReport().timeoutMs

    let status: AutomationHealthReport["status"]

    if (ageMs > timeoutMs) {
      status = "dead"
    } else if (ageMs > this.degradedThresholdMs) {
      status = "degraded"
    } else {
      status = "healthy"
    }

    return {
      status,
      lastBeat,
      ageMs,
      timeoutMs,
      timestamp: Date.now()
    }
  }
}
