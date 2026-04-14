// src/fusion/global_readiness_engine.ts

import { GlobalIntelligence } from "./global_intelligence_engine"
import { GlobalConfidenceOutput } from "./global_confidence_engine"
import { GlobalTelemetryOutput } from "./global_telemetry_engine"
import { GlobalSafetyOutput } from "./global_safety_engine"
import { GlobalExecutionOutput } from "./global_execution_engine"
import { GlobalRoutingOutput } from "./global_routing_engine"
import { GlobalWeightingOutput } from "./global_weighting_engine"

export interface GlobalReadinessInputs {
  global_intelligence: GlobalIntelligence
  global_confidence: GlobalConfidenceOutput
  global_telemetry: GlobalTelemetryOutput
  global_safety: GlobalSafetyOutput
  global_execution: GlobalExecutionOutput
  global_routing: GlobalRoutingOutput
  global_weighting: GlobalWeightingOutput
}

export interface GlobalReadinessOutput {
  readiness_level: string
  readiness_score: number
  can_trade: boolean
  can_scale: boolean
  can_hedge: boolean
  can_adjust_exposure: boolean
  reasoning: string
}

export function computeGlobalReadiness(inputs: GlobalReadinessInputs): GlobalReadinessOutput {
  const {
    global_intelligence,
    global_confidence,
    global_telemetry,
    global_safety,
    global_execution,
    global_routing,
    global_weighting
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const global_score = clamp(global_intelligence.global_score)
  const confidence = clamp(global_confidence.confidence_score)
  const alignment = clamp(global_intelligence.fusion.alignment)
  const divergence = clamp(global_intelligence.fusion.divergence)
  const volatility_stress = clamp(global_telemetry.volatility_stress)

  const safe = !global_safety.kill_switch && global_safety.safe_to_execute

  // Readiness score blends stability + confidence + safety
  const readiness_score = clamp(
    0.35 * confidence +
    0.25 * alignment +
    0.20 * global_score +
    0.10 * (1 - divergence) +
    0.10 * (1 - volatility_stress)
  )

  const readiness_level =
    !safe ? "not_ready" :
    readiness_score >= 0.80 ? "fully_ready" :
    readiness_score >= 0.60 ? "ready" :
    readiness_score >= 0.45 ? "caution" :
    "not_ready"

  const can_trade =
    safe &&
    readiness_score >= 0.50 &&
    global_telemetry.execution_readiness !== "not_ready"

  const can_scale =
    can_trade &&
    readiness_score >= 0.65 &&
    confidence >= 0.60 &&
    alignment >= 0.55

  const can_hedge =
    safe &&
    (divergence >= 0.40 || volatility_stress >= 0.50)

  const can_adjust_exposure =
    safe &&
    readiness_score >= 0.45

  const reasoning = `
Global Readiness Evaluation

Inputs:
- Global score: ${global_score}
- Confidence: ${confidence}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Volatility stress: ${volatility_stress}
- Safety: ${safe}

Readiness score: ${readiness_score.toFixed(4)}
Readiness level: ${readiness_level}

Capabilities:
- Can trade: ${can_trade}
- Can scale: ${can_scale}
- Can hedge: ${can_hedge}
- Can adjust exposure: ${can_adjust_exposure}
`.trim()

  return {
    readiness_level,
    readiness_score: Number(readiness_score.toFixed(4)),
    can_trade,
    can_scale,
    can_hedge,
    can_adjust_exposure,
    reasoning
  }
}
