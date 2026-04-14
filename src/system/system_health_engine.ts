// src/system/system_health_engine.ts

import { SystemOrchestrationState } from "./system_orchestration_engine"

export interface SystemHealthOutput {
  system_health: string
  system_signal_quality: string
  system_volatility_stress: number
  system_alignment_stability: number
  system_confidence_stability: number

  metrics: {
    global_score: number
    meta_score: number
    fusion_confidence: number
    alignment: number
    divergence: number
    volatility: number
    uncertainty: number
  }

  reasoning: string
}

export function computeSystemHealth(
  state: SystemOrchestrationState
): SystemHealthOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const global_score = clamp(state.global.global_score)
  const meta_score = clamp(state.meta.meta.meta_score)
  const fusion_confidence = clamp(state.output.fusion_confidence)

  const alignment = clamp(state.fusion.global.intelligence.fusion.alignment)
  const divergence = clamp(state.fusion.global.intelligence.fusion.divergence)
  const volatility = clamp(state.telemetry.fusion_volatility_stress)
  const uncertainty = clamp(state.meta.meta.meta_uncertainty)

  // System volatility stress
  const system_volatility_stress = Number(
    clamp(
      0.40 * volatility +
      0.30 * uncertainty +
      0.30 * divergence
    ).toFixed(4)
  )

  // System alignment stability
  const system_alignment_stability = Number(
    clamp(
      alignment * (1 - divergence) * (1 - uncertainty)
    ).toFixed(4)
  )

  // System confidence stability
  const system_confidence_stability = Number(
    clamp(
      0.40 * fusion_confidence +
      0.30 * meta_score +
      0.30 * global_score
    ).toFixed(4)
  )

  // System health label
  const system_health =
    system_confidence_stability >= 0.75 && system_volatility_stress <= 0.35
      ? "excellent"
      : system_confidence_stability >= 0.60 && system_volatility_stress <= 0.50
      ? "good"
      : system_confidence_stability >= 0.45 && system_volatility_stress <= 0.65
      ? "fair"
      : "degraded"

  // System signal quality
  const system_signal_quality =
    system_alignment_stability >= 0.70 ? "high" :
    system_alignment_stability >= 0.50 ? "medium" :
    system_alignment_stability >= 0.35 ? "low" :
    "very_low"

  const metrics = {
    global_score,
    meta_score,
    fusion_confidence,
    alignment,
    divergence,
    volatility,
    uncertainty
  }

  const reasoning = `
System Health Evaluation

Inputs:
- Global score: ${global_score}
- Meta score: ${meta_score}
- Fusion confidence: ${fusion_confidence}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Volatility: ${volatility}
- Uncertainty: ${uncertainty}

Computed:
- System volatility stress: ${system_volatility_stress}
- System alignment stability: ${system_alignment_stability}
- System confidence stability: ${system_confidence_stability}

Outputs:
- System health: ${system_health}
- System signal quality: ${system_signal_quality}
`.trim()

  return {
    system_health,
    system_signal_quality,
    system_volatility_stress,
    system_alignment_stability,
    system_confidence_stability,
    metrics,
    reasoning
  }
}
