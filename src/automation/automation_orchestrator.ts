// src/automation/automation_orchestrator.ts

import { normalizeTradingViewInput, RawTradingViewPayload } from "./tv_input_normalizer"
import { computeAutomationSignal } from "./signal_engine"
import { computeAutomationDecision } from "./decision_engine"
import { computeAutomationRisk } from "./risk_engine"
import { computeExecutionPlan } from "./execution_engine"
import { validateExecutionPlan } from "./execution_validator"
import { computeFinalOrder } from "./order_engine"
import { validateFinalOrder } from "./order_validator"
import { routeOrder } from "./order_router"
import { createDispatchPackage } from "./order_dispatch_engine"

export interface FullAutomationResult {
  normalized: ReturnType<typeof normalizeTradingViewInput>
  signal: ReturnType<typeof computeAutomationSignal>
  decision: ReturnType<typeof computeAutomationDecision>
  risk: ReturnType<typeof computeAutomationRisk>
  executionPlan: ReturnType<typeof computeExecutionPlan>
  executionValidation: ReturnType<typeof validateExecutionPlan>
  finalOrder: ReturnType<typeof computeFinalOrder>
  orderValidation: ReturnType<typeof validateFinalOrder>
  routed: ReturnType<typeof routeOrder>
  dispatch: ReturnType<typeof createDispatchPackage>
  timestamp: number
}

/**
 * Runs the entire 9‑stage automation pipeline.
 */
export function runFullAutomationPipeline(
  payload: RawTradingViewPayload
): FullAutomationResult {
  // Stage 1
  const normalized = normalizeTradingViewInput(payload)

  // Stage 2
  const signal = computeAutomationSignal(normalized)

  // Stage 3
  const decision = computeAutomationDecision(signal)

  // Stage 4
  const risk = computeAutomationRisk(decision)

  // Stage 5
  const executionPlan = computeExecutionPlan(risk)

  // Stage 6
  const executionValidation = validateExecutionPlan(executionPlan)

  // Stage 7
  const finalOrder = computeFinalOrder(executionValidation)

  // Stage 8
  const orderValidation = validateFinalOrder(finalOrder)

  // Stage 9
  const routed = routeOrder(orderValidation)

  // Stage 10
  const dispatch = createDispatchPackage(routed)

  return {
    normalized,
    signal,
    decision,
    risk,
    executionPlan,
    executionValidation,
    finalOrder,
    orderValidation,
    routed,
    dispatch,
    timestamp: Date.now()
  }
}
