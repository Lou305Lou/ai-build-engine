// src/automation/logs/automation_pipeline_runner.ts

import { RawTradingViewPayload } from "../tv_input_normalizer"
import { runFullAutomationPipeline, FullAutomationResult } from "../automation_orchestrator"
import { AutomationPipelineLogger } from "./pipeline_logger"

/**
 * Runs the full automation pipeline with structured logging.
 * This is the logged variant of the orchestrator.
 */
export async function runLoggedAutomationPipeline(
  payload: RawTradingViewPayload,
  options?: {
    logDir?: string
    logger?: AutomationPipelineLogger
  }
): Promise<FullAutomationResult> {
  const logger =
    options?.logger ??
    new AutomationPipelineLogger(options?.logDir ?? "logs/automation")

  try {
    const result = runFullAutomationPipeline(payload)

    // Log full pipeline + dispatch
    logger.logPipeline(result)
    logger.logDispatch(result.dispatch)

    return result
  } catch (err: any) {
    logger.logError("Automation pipeline failed", {
      error: err?.message ?? "Unknown error",
      stack: err?.stack
    })
    throw err
  }
}
