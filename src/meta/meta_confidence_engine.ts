// src/meta/meta_confidence_engine.ts

import { HyperMetaOutput } from "./hyper_meta_engine"
import { GlobalState } from "../fusion/global_state_engine"

export interface MetaConfidenceOutput {
  meta_confidence_score: number
  meta_confidence_label: string

  meta_stability: number
  meta_volatility: number
  meta_alignment: number
  meta_uncertainty: number

  meta_confidence_summary: string
  reasoning: string
}

export function computeMetaConfidence(
  state: GlobalState,
  hyper: HyperMetaOutput
): MetaConfidenceOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const alignment = clamp(state.intelligence.fusion.alignment)
  const divergence = clamp(state.intelligence.fusion.divergence)
  const global_conf = clamp(state.confidence.confidence_score)

  // Meta‑stability: how stable the meta‑layer is
  const meta_stability = clamp(
    0.40 * hyper.coherence_score +
    0.30 * hyper.reasoning_quality +
    0.30 * (1 - divergence)
  )

  // Meta‑volatility: instability in reasoning + divergence + system volatility
  const meta_volatility = clamp(
    0.50 * divergence +
    0.30 * (1 - hyper.reasoning_quality) +
    0.20 * state.telemetry.volatility_stress
  )

  // Meta‑alignment: how aligned the meta‑layer is with the global layer
  const meta_alignment = clamp(
    0.50 * alignment +
    0.30 * hyper.coherence_score +
    0.20 * global_conf
  )

  // Meta‑uncertainty: inverse of stability + alignment
  const meta_uncertainty = clamp(
    1 -
    (0.50 * meta_stability +
     0.30 * meta_alignment +
     0.20 * hyper.justification_strength)
  )

  // Meta‑confidence score
  const meta_confidence_score = clamp(
    0.40 * meta_stability +
    0.30 * meta_alignment +
    0.20 * hyper.justification_strength -
    0.10 * meta_volatility
  )

  const meta_confidence_label =
    meta_confidence_score >= 0.85 ? "very_high" :
    meta_confidence_score >= 0.70 ? "high" :
    meta_confidence_score >= 0.55 ? "moderate" :
    meta_confidence_score >= 0.40 ? "low" :
    "very_low"

  const meta_confidence_summary = `
Meta-Confidence:
- ${meta_confidence_label.toUpperCase()} (${(meta_confidence_score * 100).toFixed(1)}%)
- Stability: ${(meta_stability * 100).toFixed(1)}%
- Alignment: ${(meta_alignment * 100).toFixed(1)}%
- Volatility: ${(meta_volatility * 100).toFixed(1)}%
- Uncertainty: ${(meta_uncertainty * 100).toFixed(1)}%
`.trim()

  const reasoning = `
Meta-Confidence Evaluation

Inputs:
- Alignment: ${alignment}
- Divergence: ${divergence}
- Global confidence: ${global_conf}
- Meta reasoning quality: ${hyper.reasoning_quality}
- Meta coherence: ${hyper.coherence_score}
- Meta justification: ${hyper.justification_strength}

Computed:
- Meta stability: ${meta_stability}
- Meta volatility: ${meta_volatility}
- Meta alignment: ${meta_alignment}
- Meta uncertainty: ${meta_uncertainty}

Final:
- Meta confidence score: ${meta_confidence_score}
- Meta confidence label: ${meta_confidence_label}
`.trim()

  return {
    meta_confidence_score,
    meta_confidence_label,
    meta_stability,
    meta_volatility,
    meta_alignment,
    meta_uncertainty,
    meta_confidence_summary,
    reasoning
  }
}
