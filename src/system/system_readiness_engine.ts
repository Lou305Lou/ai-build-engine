// src/system/system_readiness_engine.ts

import { SystemOrchestrationState } from "./system_orchestration_engine"
import { SystemHealthOutput } from "./system_health_engine"
import { SystemSafetyOutput } from "./system_safety_engine"

export interface SystemReadinessOutput {
  system_readiness_level: string
  system_readiness_score: number

  can_execute: boolean
  can_influence: boolean
  can_override: boolean

  reasoning: string
}

export function computeSystemReadiness(
  state: SystemOrchestrationState,
  health: SystemHealthOutput,
  safety: SystemSafetyOutput
): SystemReadinessOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const global_score = clamp(state.global.global_score)
  const meta_score = clamp(state.meta.meta.meta_score)
  const fusion_confidence = clamp(state.output.fusion_confidence)

  const alignment = clamp(state.fusion.global.intelligence.fusion.alignment)
  const divergence = clamp(state.fusion.global.intelligence.fusion.divergence)
  const volatility = clamp(health.system_volatility_stress)
  const uncertainty = clamp(state.meta.meta.meta_uncertainty)

  const safe = safety.system_safe && !safety.system_kill_switch

  // Readiness score blends global + meta + fusion + stability
  const system_readiness_score = clamp(
    0.30 * global_score +
    0.30 * meta_score +
    0.20 * fusion_confidence +
    0.10 * (1 - divergence) +
    0.10 * (1 - volatility)
  )

  const system_readiness_level =
    !safe ? "not_ready" :
    system_readiness_score >= 0.80 ? "fully_ready" :
    system_readiness_score >= 0.60 ? "ready" :
    system_readiness_score >= 0.45 ? "caution" :
    "not_ready"

  const can_execute =
    safe &&
    system_readiness_score >= 0.55 &&
    state.output.execution_allowed

  const can_influence =
    safe &&
    system_readiness_score >= 0.50 &&
    fusion_confidence >= 0.45

  const can_override =
    safe &&
    system_readiness_score >= 0.70 &&
    fusion_confidence >= 0.65 &&
    alignment >= 0.60

  const reasoning = `
System Readiness Evaluation

Inputs:
- Global score: ${global_score}
- Meta score: ${meta_score}
- Fusion confidence: ${fusion_confidence}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Volatility: ${volatility}
- Uncertainty: ${uncertainty}
- System safe: ${safe}

Readiness score: ${system_readiness_score.toFixed(4)}
Readiness level: ${system_readiness_level}

Capabilities:
- Can execute: ${can_execute}
- Can influence: ${can_influence}
- Can override: ${can_override}
`.trim()

  return {
    system_readiness_level,
    system_readiness_score: Number(system_readiness_score.toFixed(4)),
    can_execute,
    can_influence,
    can_override,
    reasoning
  }
}
