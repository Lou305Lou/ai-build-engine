// src/fusion/fusion_telemetry_engine.ts

import { FusionState } from "./fusion_state_engine"

export interface FusionTelemetryOutput {
  fusion_health: string
  fusion_signal_quality: string
  fusion_volatility_stress: number
  fusion_alignment_stability: number
  fusion_confidence_stability: number
  fusion_execution_readiness: string

  metrics: {
    global_score: number
    meta_score: number
    meta_confidence: number
    alignment: number
    divergence: number
    volatility: number
    uncertainty: number
  }

  reasoning: string
}

export function computeFusionTelemetry(
  fusion: FusionState
): FusionTelemetryOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const global_score = clamp(fusion.global.global_score)
  const meta_score = clamp(fusion.meta.meta.meta_score)
  const meta_confidence = clamp(fusion.meta.meta.meta_confidence_score)

  const alignment = clamp(fusion.global.intelligence.fusion.alignment)
  const divergence = clamp(fusion.global.intelligence.fusion.divergence)
  const volatility = clamp(fusion.global.telemetry.volatility_stress)
  const uncertainty = clamp(fusion.meta.meta.meta_uncertainty)

  // Fusion volatility stress
  const fusion_volatility_stress = Number(
    clamp(
      0.40 * volatility +
      0.30 * uncertainty +
      0.30 * divergence
    ).toFixed(4)
  )

  // Fusion alignment stability
  const fusion_alignment_stability = Number(
    clamp(
      alignment * (1 - divergence) * (1 - uncertainty)
    ).toFixed(4)
  )

  // Fusion confidence stability
  const fusion_confidence_stability = Number(
    clamp(
      0.40 * meta_confidence +
      0.30 * meta_score +
      0.30 * global_score
    ).toFixed(4)
  )

  // Fusion health
  const fusion_health =
    fusion_confidence_stability >= 0.75 && fusion_volatility_stress <= 0.35
      ? "excellent"
      : fusion_confidence_stability >= 0.60 && fusion_volatility_stress <= 0.50
      ? "good"
      : fusion_confidence_stability >= 0.45 && fusion_volatility_stress <= 0.65
      ? "fair"
      : "degraded"

  // Fusion signal quality
  const fusion_signal_quality =
    fusion_alignment_stability >= 0.70 ? "high" :
    fusion_alignment_stability >= 0.50 ? "medium" :
    fusion_alignment_stability >= 0.35 ? "low" :
    "very_low"

  // Fusion execution readiness
  const fusion_execution_readiness =
    fusion_health === "excellent" && fusion_signal_quality === "high"
      ? "ready"
      : fusion_health === "good"
      ? "caution"
      : "not_ready"

  const metrics = {
    global_score,
    meta_score,
    meta_confidence,
    alignment,
    divergence,
    volatility,
    uncertainty
  }

  const reasoning = `
Fusion Telemetry Evaluation

Inputs:
- Global score: ${global_score}
- Meta score: ${meta_score}
- Meta confidence: ${meta_confidence}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Volatility: ${volatility}
- Uncertainty: ${uncertainty}

Computed:
- Fusion volatility stress: ${fusion_volatility_stress}
- Fusion alignment stability: ${fusion_alignment_stability}
- Fusion confidence stability: ${fusion_confidence_stability}

Outputs:
- Fusion health: ${fusion_health}
- Fusion signal quality: ${fusion_signal_quality}
- Fusion execution readiness: ${fusion_execution_readiness}
`.trim()

  return {
    fusion_health,
    fusion_signal_quality,
    fusion_volatility_stress,
    fusion_alignment_stability,
    fusion_confidence_stability,
    fusion_execution_readiness,
    metrics,
    reasoning
  }
}
