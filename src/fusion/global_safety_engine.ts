// src/fusion/global_safety_engine.ts

import { GlobalIntelligence } from "./global_intelligence_engine"
import { GlobalConfidenceOutput } from "./global_confidence_engine"
import { GlobalTelemetryOutput } from "./global_telemetry_engine"
import { GlobalExecutionOutput } from "./global_execution_engine"

export interface GlobalSafetyInputs {
  global_intelligence: GlobalIntelligence
  global_confidence: GlobalConfidenceOutput
  global_telemetry: GlobalTelemetryOutput
  global_execution: GlobalExecutionOutput
}

export interface GlobalSafetyOutput {
  safe_to_execute: boolean
  safety_label: string
  kill_switch: boolean
  reasons: string[]
  reasoning: string
}

export function computeGlobalSafety(inputs: GlobalSafetyInputs): GlobalSafetyOutput {
  const { global_intelligence, global_confidence, global_telemetry, global_execution } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const global_score = clamp(global_intelligence.global_score)
  const confidence = clamp(global_confidence.confidence_score)
  const alignment = clamp(global_intelligence.fusion.alignment)
  const divergence = clamp(global_intelligence.fusion.divergence)
  const volatility_stress = clamp(global_telemetry.volatility_stress)

  const reasons: string[] = []

  // Safety thresholds
  const CONFIDENCE_MIN = 0.35
  const ALIGNMENT_MIN = 0.30
  const DIVERGENCE_MAX = 0.70
  const VOLATILITY_MAX = 0.80

  // Kill-switch conditions
  const kill_switch =
    confidence < 0.20 ||
    divergence > 0.85 ||
    volatility_stress > 0.90

  if (kill_switch) {
    reasons.push("Kill-switch triggered due to extreme instability.")
  }

  // Additional safety checks
  if (confidence < CONFIDENCE_MIN) {
    reasons.push("Confidence below minimum threshold.")
  }

  if (alignment < ALIGNMENT_MIN) {
    reasons.push("Micro–macro alignment too low.")
  }

  if (divergence > DIVERGENCE_MAX) {
    reasons.push("Micro–macro divergence too high.")
  }

  if (volatility_stress > VOLATILITY_MAX) {
    reasons.push("Volatility stress exceeds safe limits.")
  }

  // Final safety decision
  const safe_to_execute =
    !kill_switch &&
    confidence >= CONFIDENCE_MIN &&
    alignment >= ALIGNMENT_MIN &&
    divergence <= DIVERGENCE_MAX &&
    volatility_stress <= VOLATILITY_MAX

  const safety_label =
    kill_switch ? "unsafe" :
    safe_to_execute ? "safe" :
    "caution"

  const reasoning = `
Global Safety Evaluation

Inputs:
- Global score: ${global_score}
- Confidence: ${confidence}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Volatility stress: ${volatility_stress}

Thresholds:
- Confidence >= ${CONFIDENCE_MIN}
- Alignment >= ${ALIGNMENT_MIN}
- Divergence <= ${DIVERGENCE_MAX}
- Volatility stress <= ${VOLATILITY_MAX}

Kill-switch: ${kill_switch}

Final:
- Safe to execute: ${safe_to_execute}
- Safety label: ${safety_label}
- Reasons: ${reasons.length > 0 ? reasons.join("; ") : "None"}
`.trim()

  return {
    safe_to_execute,
    safety_label,
    kill_switch,
    reasons,
    reasoning
  }
}
