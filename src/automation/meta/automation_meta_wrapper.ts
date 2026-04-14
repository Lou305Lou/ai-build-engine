// src/automation/meta/automation_meta_wrapper.ts

import { AutomationOrchestrator, FullAutomationResult } from "../automation_orchestrator"
import { SafetyMetaEngine, AutomationSafetyReport } from "../safety/safety_meta_engine"
import { SafetyGatekeeper, AutomationSafetyGateDecision } from "../safety/safety_gatekeeper"
import { AutomationHeartbeat } from "./automation_heartbeat"
import { AutomationHealthMonitor, AutomationHealthReport } from "./automation_health_monitor"
import { AutomationMetaLogger } from "./automation_meta_logger"

/**
 * Unified result returned by the meta-aware automation wrapper.
 */
export interface MetaAutomationResult {
  pipeline: FullAutomationResult
  safety: AutomationSafetyReport
  gate: AutomationSafetyGateDecision
  health: AutomationHealthReport
  timestamp: number
}

/**
 * Automation Meta Wrapper
 *
 * Integrates:
 * - automation pipeline
 * - heartbeat
 * - safety evaluation
 * - safety gatekeeper
 * - health monitor
 * - meta-logger
 */
export class AutomationMetaWrapper {
  private orchestrator: AutomationOrchestrator
  private safetyEngine: SafetyMetaEngine
  private gatekeeper: SafetyGatekeeper
  private heartbeat: AutomationHeartbeat
  private healthMonitor: AutomationHealthMonitor
  private metaLogger: AutomationMetaLogger

  constructor(orchestrator: AutomationOrchestrator) {
    this.orchestrator = orchestrator
    this.safetyEngine = new SafetyMetaEngine()
    this.gatekeeper = new SafetyGatekeeper()
    this.heartbeat = new AutomationHeartbeat()
    this.healthMonitor = new AutomationHealthMonitor(this.heartbeat)
    this.metaLogger = new AutomationMetaLogger(this.heartbeat, this.healthMonitor)
  }

  /**
   * Runs the full automation pipeline with safety + meta layers.
   */
  async run(symbol: string): Promise<MetaAutomationResult> {
    // --- Pipeline execution ---
    const pipelineResult = await this.orchestrator.run(symbol)

    // --- Heartbeat update ---
    this.heartbeat.beat()
    this.metaLogger.logHeartbeat()

    // --- Safety evaluation ---
    const safetyReport = this.safetyEngine.evaluate(pipelineResult)
    this.metaLogger.logSafetyReport(safetyReport)

    // --- Gatekeeper decision ---
    const gateDecision = this.gatekeeper.enforce(safetyReport)
    this.metaLogger.logGateDecision(gateDecision)

    // --- Health evaluation ---
    const healthReport = this.healthMonitor.getHealth()
    this.metaLogger.logHealth()

    // --- Lifecycle logging ---
    this.metaLogger.logLifecycle("automation_run_completed", {
      symbol,
      allowed: gateDecision.allowed
    })

    return {
      pipeline: pipelineResult,
      safety: safetyReport,
      gate: gateDecision,
      health: healthReport,
      timestamp: Date.now()
    }
  }
}
