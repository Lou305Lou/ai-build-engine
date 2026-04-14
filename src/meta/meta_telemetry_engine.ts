// src/meta/meta_telemetry_engine.ts

import { HyperMetaOutput } from "./hyper_meta_engine"
import { MetaConfidenceOutput } from "./meta_confidence_engine"
import { MetaRoutingOutput } from "./meta_routing_engine"
import { MetaWeightingOutput } from "./meta_weighting_engine"
import { MetaExecutionOutput } from "./meta_execution_engine"

export interface MetaTelemetryOutput {
  meta_health: string
  meta_signal_quality: string
  meta_volatility_stress: number
  meta_alignment_stability: number
  meta_confidence_stability: number
  meta_execution_readiness: string

  metrics: {
    meta_score: number
    meta_confidence: number
    meta_alignment: number
    meta_uncertainty: number
    meta_volatility: number
    contradiction_score: number
  }

  reasoning: string
}

export function computeMetaTelemetry(
  hyper: HyperMetaOutput,
  meta_conf: MetaConfidenceOutput,
  meta_routing: MetaRoutingOutput,
  meta_weighting: MetaWeightingOutput,
  meta_execution: MetaExecutionOutput
): MetaTelemetryOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const meta_score = clamp(hyper.meta_score)
  const meta_conf_score = clamp(meta_conf.meta_confidence_score)
  const meta_alignment = clamp(meta_conf.meta_alignment)
  const meta_uncertainty = clamp(meta_conf.meta_uncertainty)
  const meta_volatility = clamp(meta_conf.meta_volatility)
  const contradiction_score = clamp(hyper.contradiction_score)

  // Meta‑volatility stress
  const meta_volatility_stress = Number(
    clamp(
      0.50 * meta_volatility +
      0.30 * meta_uncertainty +
      0.20 * contradiction_score
    ).toFixed(4)
  )

  // Alignment stability
  const meta_alignment_stability = Number(
    clamp(
      meta_alignment * (1 - meta_uncertainty)
    ).toFixed(4)
  )

  // Confidence stability
  const meta_confidence_stability = Number(
    clamp(
      0.50 * meta_conf_score +
      0.30 * meta_alignment -
      0.20 * meta_volatility
    ).toFixed(4)
  )

  // Meta‑health
  const meta_health =
    meta_confidence_stability >= 0.75 && meta_volatility_stress <= 0.35 ? "excellent" :
    meta_confidence_stability >= 0.60 && meta_volatility_stress <= 0.50 ? "good" :
    meta_confidence_stability >= 0.45 && meta_volatility_stress <= 0.65 ? "fair" :
    "degraded"

  // Meta‑signal quality
  const meta_signal_quality =
    meta_alignment >= 0.70 && meta_uncertainty <= 0.30 ? "high" :
    meta_alignment >= 0.50 ? "medium" :
    meta_alignment >= 0.35 ? "low" :
    "very_low"

  // Meta‑execution readiness
  const meta_execution_readiness =
    meta_execution.execution_veto ? "not_ready" :
    meta_health === "excellent" && meta_signal_quality === "high" ? "ready" :
    meta_health === "good" ? "caution" :
    "not_ready"

  const metrics = {
    meta_score,
    meta_confidence: meta_conf_score,
    meta_alignment,
    meta_uncertainty,
    meta_volatility,
    contradiction_score
  }

  const reasoning = `
Meta Telemetry Evaluation

Inputs:
- Meta score: ${meta_score}
- Meta confidence: ${meta_conf_score}
- Meta alignment: ${meta_alignment}
- Meta uncertainty: ${meta_uncertainty}
- Meta volatility: ${meta_volatility}
- Contradiction score: ${contradiction_score}

Computed:
- Meta volatility stress: ${meta_volatility_stress}
- Meta alignment stability: ${meta_alignment_stability}
- Meta confidence stability: ${meta_confidence_stability}

Outputs:
- Meta health: ${meta_health}
- Meta signal quality: ${meta_signal_quality}
- Meta execution readiness: ${meta_execution_readiness}
`.trim()

  return {
    meta_health,
    meta_signal_quality,
    meta_volatility_stress,
    meta_alignment_stability,
    meta_confidence_stability,
    meta_execution_readiness,
    metrics,
    reasoning
  }
}
