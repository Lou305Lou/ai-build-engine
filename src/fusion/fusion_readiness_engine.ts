// src/fusion/fusion_readiness_engine.ts

import { FusionState } from "./fusion_state_engine"
import { FusionTelemetryOutput } from "./fusion_telemetry_engine"
import { FusionSafetyOutput } from "./fusion_safety_engine"

export interface FusionReadinessOutput {
  fusion_readiness_level: string
  fusion_readiness_score: number

  can_influence_global: boolean
  can_influence_meta: boolean
  can_execute: boolean
  can_override: boolean

  reasoning: string
}

export function computeFusionReadiness(
  fusion: FusionState,
  telemetry: FusionTelemetryOutput,
  safety: FusionSafetyOutput
): FusionReadinessOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const global_score = clamp(fusion.global.global_score)
  const meta_score = clamp(fusion.meta.meta.meta_score)
  const meta_confidence = clamp(fusion.meta.meta.meta_confidence_score)

  const alignment = clamp(fusion.global.intelligence.fusion.alignment)
  const divergence = clamp(fusion.global.intelligence.fusion.divergence)
  const volatility = clamp(fusion.global.telemetry.volatility_stress)
  const uncertainty = clamp(fusion.meta.meta.meta_uncertainty)

  const safe = safety.fusion_safe && !safety.fusion_kill_switch

  // Readiness score blends global + meta + fusion stability
  const fusion_readiness_score = clamp(
    0.30 * global_score +
    0.30 * meta_score +
    0.20 * meta_confidence +
    0.10 * (1 - divergence) +
    0.10 * (1 - volatility)
  )

  const fusion_readiness_level =
    !safe ? "not_ready" :
    fusion_readiness_score >= 0.80 ? "fully_ready" :
    fusion_readiness_score >= 0.60 ? "ready" :
    fusion_readiness_score >= 0.45 ? "caution" :
    "not_ready"

  const can_influence_global =
    safe &&
    fusion_readiness_score >= 0.50 &&
    telemetry.fusion_execution_readiness !== "not_ready"

  const can_influence_meta =
    safe &&
    fusion_readiness_score >= 0.55 &&
    meta_confidence >= 0.50

  const can_execute =
    safe &&
    fusion_readiness_score >= 0.55 &&
    telemetry.fusion_execution_readiness !== "not_ready"

  const can_override =
    safe &&
    fusion_readiness_score >= 0.70 &&
    meta_confidence >= 0.65 &&
    alignment >= 0.60

  const reasoning = `
Fusion Readiness Evaluation

Inputs:
- Global score: ${global_score}
- Meta score: ${meta_score}
- Meta confidence: ${meta_confidence}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Volatility: ${volatility}
- Uncertainty: ${uncertainty}
- Fusion safe: ${safe}

Readiness score: ${fusion_readiness_score.toFixed(4)}
Readiness level: ${fusion_readiness_level}

Capabilities:
- Can influence global: ${can_influence_global}
- Can influence meta: ${can_influence_meta}
- Can execute: ${can_execute}
- Can override: ${can_override}
`.trim()

  return {
    fusion_readiness_level,
    fusion_readiness_score: Number(fusion_readiness_score.toFixed(4)),
    can_influence_global,
    can_influence_meta,
    can_execute,
    can_override,
    reasoning
  }
}
