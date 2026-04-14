// src/automation/logs/pipeline_logger.ts

import { AutomationLogWriter } from "./log_writer"
import { FullAutomationResult } from "../automation_orchestrator"

/**
 * Logs every stage of the automation pipeline.
 * This provides full traceability for dashboards, terminal UI, and Qwen reasoning.
 */
export class AutomationPipelineLogger {
  private writer: AutomationLogWriter

  constructor(logDir = "logs/automation") {
    this.writer = new AutomationLogWriter(logDir)
  }

  /**
   * Logs the entire pipeline result.
   */
  logPipeline(result: FullAutomationResult) {
    this.writer.pipeline("Pipeline run complete", {
      timestamp: result.timestamp,
      normalized: result.normalized,
      signal: result.signal,
      decision: result.decision,
      risk: result.risk,
      executionPlan: result.executionPlan,
      executionValidation: result.executionValidation,
      finalOrder: result.finalOrder,
      orderValidation: result.orderValidation,
      routed: result.routed,
      dispatch: result.dispatch
    })
  }

  /**
   * Logs only the dispatch package.
   */
  logDispatch(dispatch: FullAutomationResult["dispatch"]) {
    this.writer.dispatch("Dispatch package generated", dispatch)
  }

  /**
   * Logs an error during automation.
   */
  logError(message: string, data?: any) {
    this.writer.error(message, data)
  }

  /**
   * Logs debug information.
   */
  debug(message: string, data?: any) {
    this.writer.debug(message, data)
  }
}
