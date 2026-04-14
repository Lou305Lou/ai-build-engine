// src/system/system_safety_engine.ts

import { SystemOrchestrationState } from "./system_orchestration_engine"
import { SystemHealthOutput } from "./system_health_engine"

export interface SystemSafetyOutput {
  system_safe: boolean
  system_safety_label: string
  system_kill_switch: boolean
  reasons: string[]
  reasoning: string
}

export function computeSystemSafety(
  state: SystemOrchestrationState,
  health: SystemHealthOutput
): SystemSafetyOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const global_status = state.global.system_status
  const meta_status = state.meta.meta_system_status
  const fusion_status = state.fusion.fusion_status

  const global_score = clamp(state.global.global_score)
  const meta_score = clamp(state.meta.meta.meta_score)
  const fusion_confidence = clamp(state.output.fusion_confidence)

  const divergence = clamp(state.fusion.global.intelligence.fusion.divergence)
  const volatility = clamp(health.system_volatility_stress)
  const uncertainty = clamp(state.meta.meta.meta_uncertainty)

  const reasons: string[] = []

  // Thresholds
  const MIN_GLOBAL_SCORE = 0.40
  const MIN_META_SCORE = 0.45
  const MIN_FUSION_CONF = 0.40

  const MAX_DIVERGENCE = 0.70
  const MAX_VOLATILITY = 0.75
  const MAX_UNCERTAINTY = 0.75

  // Kill-switch conditions
  const system_kill_switch =
    global_status === "halted" ||
    meta_status === "halted" ||
    fusion_status === "halted" ||
    global_score < 0.25 ||
    meta_score < 0.30 ||
    fusion_confidence < 0.25 ||
    divergence > 0.85 ||
    volatility > 0.85 ||
    uncertainty > 0.85

  if (system_kill_switch) {
    reasons.push("System kill-switch triggered due to extreme instability.")
  }

  // Additional safety checks
  if (global_score < MIN_GLOBAL_SCORE) {
    reasons.push("Global score below minimum threshold.")
  }

  if (meta_score < MIN_META_SCORE) {
    reasons.push("Meta score below minimum threshold.")
  }

  if (fusion_confidence < MIN_FUSION_CONF) {
    reasons.push("Fusion confidence below minimum threshold.")
  }

  if (divergence > MAX_DIVERGENCE) {
    reasons.push("System divergence too high.")
  }

  if (volatility > MAX_VOLATILITY) {
    reasons.push("System volatility exceeds safe limits.")
  }

  if (uncertainty > MAX_UNCERTAINTY) {
    reasons.push("System uncertainty too high.")
  }

  // Final safety decision
  const system_safe =
    !system_kill_switch &&
    global_score >= MIN_GLOBAL_SCORE &&
    meta_score >= MIN_META_SCORE &&
    fusion_confidence >= MIN_FUSION_CONF &&
    divergence <= MAX_DIVERGENCE &&
    volatility <= MAX_VOLATILITY &&
    uncertainty <= MAX_UNCERTAINTY

  const system_safety_label =
    system_kill_switch ? "unsafe" :
    system_safe ? "safe" :
    "caution"

  const reasoning = `
System Safety Evaluation

Inputs:
- Global score: ${global_score}
- Meta score: ${meta_score}
- Fusion confidence: ${fusion_confidence}
- Divergence: ${divergence}
- Volatility: ${volatility}
- Uncertainty: ${uncertainty}
- Global status: ${global_status}
- Meta status: ${meta_status}
- Fusion status: ${fusion_status}

Thresholds:
- Global score >= ${MIN_GLOBAL_SCORE}
- Meta score >= ${MIN_META_SCORE}
- Fusion confidence >= ${MIN_FUSION_CONF}
- Divergence <= ${MAX_DIVERGENCE}
- Volatility <= ${MAX_VOLATILITY}
- Uncertainty <= ${MAX_UNCERTAINTY}

Kill-switch: ${system_kill_switch}

Final:
- System safe: ${system_safe}
- Safety label: ${system_safety_label}
- Reasons: ${reasons.length > 0 ? reasons.join("; ") : "None"}
`.trim()

  return {
    system_safe,
    system_safety_label,
    system_kill_switch,
    reasons,
    reasoning
  }
}
