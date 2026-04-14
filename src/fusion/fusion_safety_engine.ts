// src/fusion/fusion_safety_engine.ts

import { FusionState } from "./fusion_state_engine"
import { FusionTelemetryOutput } from "./fusion_telemetry_engine"

export interface FusionSafetyOutput {
  fusion_safe: boolean
  fusion_safety_label: string
  fusion_kill_switch: boolean
  reasons: string[]
  reasoning: string
}

export function computeFusionSafety(
  fusion: FusionState,
  telemetry: FusionTelemetryOutput
): FusionSafetyOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const global_status = fusion.global.system_status
  const meta_status = fusion.meta.meta_system_status

  const global_score = clamp(fusion.global.global_score)
  const meta_score = clamp(fusion.meta.meta.meta_score)
  const meta_confidence = clamp(fusion.meta.meta.meta_confidence_score)

  const alignment = clamp(fusion.global.intelligence.fusion.alignment)
  const divergence = clamp(fusion.global.intelligence.fusion.divergence)
  const volatility = clamp(fusion.global.telemetry.volatility_stress)
  const uncertainty = clamp(fusion.meta.meta.meta_uncertainty)

  const reasons: string[] = []

  // Thresholds
  const MIN_GLOBAL_SCORE = 0.40
  const MIN_META_SCORE = 0.45
  const MIN_META_CONF = 0.40

  const MAX_DIVERGENCE = 0.70
  const MAX_VOLATILITY = 0.75
  const MAX_UNCERTAINTY = 0.75

  // Kill-switch conditions
  const fusion_kill_switch =
    global_status === "halted" ||
    meta_status === "halted" ||
    global_score < 0.25 ||
    meta_score < 0.30 ||
    meta_confidence < 0.25 ||
    divergence > 0.85 ||
    volatility > 0.85 ||
    uncertainty > 0.85

  if (fusion_kill_switch) {
    reasons.push("Fusion kill-switch triggered due to extreme instability.")
  }

  // Additional safety checks
  if (global_score < MIN_GLOBAL_SCORE) {
    reasons.push("Global score below minimum threshold.")
  }

  if (meta_score < MIN_META_SCORE) {
    reasons.push("Meta score below minimum threshold.")
  }

  if (meta_confidence < MIN_META_CONF) {
    reasons.push("Meta confidence below minimum threshold.")
  }

  if (divergence > MAX_DIVERGENCE) {
    reasons.push("Fusion divergence too high.")
  }

  if (volatility > MAX_VOLATILITY) {
    reasons.push("Fusion volatility exceeds safe limits.")
  }

  if (uncertainty > MAX_UNCERTAINTY) {
    reasons.push("Fusion uncertainty too high.")
  }

  // Final safety decision
  const fusion_safe =
    !fusion_kill_switch &&
    global_score >= MIN_GLOBAL_SCORE &&
    meta_score >= MIN_META_SCORE &&
    meta_confidence >= MIN_META_CONF &&
    divergence <= MAX_DIVERGENCE &&
    volatility <= MAX_VOLATILITY &&
    uncertainty <= MAX_UNCERTAINTY

  const fusion_safety_label =
    fusion_kill_switch ? "unsafe" :
    fusion_safe ? "safe" :
    "caution"

  const reasoning = `
Fusion Safety Evaluation

Inputs:
- Global score: ${global_score}
- Meta score: ${meta_score}
- Meta confidence: ${meta_confidence}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Volatility: ${volatility}
- Uncertainty: ${uncertainty}
- Global status: ${global_status}
- Meta status: ${meta_status}

Thresholds:
- Global score >= ${MIN_GLOBAL_SCORE}
- Meta score >= ${MIN_META_SCORE}
- Meta confidence >= ${MIN_META_CONF}
- Divergence <= ${MAX_DIVERGENCE}
- Volatility <= ${MAX_VOLATILITY}
- Uncertainty <= ${MAX_UNCERTAINTY}

Kill-switch: ${fusion_kill_switch}

Final:
- Fusion safe: ${fusion_safe}
- Safety label: ${fusion_safety_label}
- Reasons: ${reasons.length > 0 ? reasons.join("; ") : "None"}
`.trim()

  return {
    fusion_safe,
    fusion_safety_label,
    fusion_kill_switch,
    reasons,
    reasoning
  }
}
