// src/meta/meta_readiness_engine.ts

import { HyperMetaOutput } from "./hyper_meta_engine"
import { MetaConfidenceOutput } from "./meta_confidence_engine"
import { MetaTelemetryOutput } from "./meta_telemetry_engine"
import { MetaSafetyOutput } from "./meta_safety_engine"
import { MetaExecutionOutput } from "./meta_execution_engine"

export interface MetaReadinessOutput {
  meta_readiness_level: string
  meta_readiness_score: number

  can_influence_routing: boolean
  can_influence_weighting: boolean
  can_influence_execution: boolean
  can_override_global: boolean

  reasoning: string
}

export function computeMetaReadiness(
  hyper: HyperMetaOutput,
  meta_conf: MetaConfidenceOutput,
  meta_telemetry: MetaTelemetryOutput,
  meta_safety: MetaSafetyOutput,
  meta_execution: MetaExecutionOutput
): MetaReadinessOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const meta_score = clamp(hyper.meta_score)
  const meta_conf_score = clamp(meta_conf.meta_confidence_score)
  const meta_alignment = clamp(meta_conf.meta_alignment)
  const meta_uncertainty = clamp(meta_conf.meta_uncertainty)
  const meta_volatility = clamp(meta_conf.meta_volatility)

  const safe = !meta_safety.meta_kill_switch && meta_safety.meta_safe

  // Readiness score blends stability + confidence + safety
  const meta_readiness_score = clamp(
    0.35 * meta_conf_score +
    0.25 * meta_alignment +
    0.20 * meta_score +
    0.10 * (1 - meta_uncertainty) +
    0.10 * (1 - meta_volatility)
  )

  const meta_readiness_level =
    !safe ? "not_ready" :
    meta_readiness_score >= 0.80 ? "fully_ready" :
    meta_readiness_score >= 0.60 ? "ready" :
    meta_readiness_score >= 0.45 ? "caution" :
    "not_ready"

  const can_influence_routing =
    safe &&
    meta_readiness_score >= 0.50 &&
    meta_telemetry.meta_execution_readiness !== "not_ready"

  const can_influence_weighting =
    can_influence_routing &&
    meta_readiness_score >= 0.60 &&
    meta_conf_score >= 0.55

  const can_influence_execution =
    safe &&
    meta_readiness_score >= 0.55 &&
    !meta_execution.execution_veto

  const can_override_global =
    safe &&
    meta_readiness_score >= 0.70 &&
    meta_conf_score >= 0.65 &&
    meta_alignment >= 0.60

  const reasoning = `
Meta Readiness Evaluation

Inputs:
- Meta score: ${meta_score}
- Meta confidence: ${meta_conf_score}
- Meta alignment: ${meta_alignment}
- Meta uncertainty: ${meta_uncertainty}
- Meta volatility: ${meta_volatility}
- Meta safe: ${safe}

Readiness score: ${meta_readiness_score.toFixed(4)}
Readiness level: ${meta_readiness_level}

Capabilities:
- Can influence routing: ${can_influence_routing}
- Can influence weighting: ${can_influence_weighting}
- Can influence execution: ${can_influence_execution}
- Can override global: ${can_override_global}
`.trim()

  return {
    meta_readiness_level,
    meta_readiness_score: Number(meta_readiness_score.toFixed(4)),
    can_influence_routing,
    can_influence_weighting,
    can_influence_execution,
    can_override_global,
    reasoning
  }
}
