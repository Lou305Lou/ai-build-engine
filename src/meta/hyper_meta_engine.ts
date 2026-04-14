// src/meta/hyper_meta_engine.ts

import { GlobalState } from "../fusion/global_state_engine"

export interface HyperMetaOutput {
  meta_score: number
  meta_label: string

  reasoning_quality: number
  coherence_score: number
  contradiction_score: number
  justification_strength: number

  meta_summary: string
  reasoning: string
}

export function computeHyperMeta(state: GlobalState): HyperMetaOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Extract relevant components
  const { intelligence, execution, safety, readiness, telemetry, confidence } = state

  const alignment = clamp(intelligence.fusion.alignment)
  const divergence = clamp(intelligence.fusion.divergence)
  const global_conf = clamp(confidence.confidence_score)

  // Reasoning quality: based on clarity + confidence + stability
  const reasoning_quality = clamp(
    0.40 * global_conf +
    0.30 * alignment +
    0.30 * (1 - divergence)
  )

  // Coherence: micro → macro → global consistency
  const coherence_score = clamp(
    0.50 * alignment +
    0.25 * (1 - divergence) +
    0.25 * (telemetry.signal_quality === "high" ? 1 : telemetry.signal_quality === "medium" ? 0.7 : 0.4)
  )

  // Contradiction score: inverse of coherence + safety issues
  const contradiction_score = clamp(
    1 -
    (0.60 * coherence_score +
     0.20 * reasoning_quality +
     0.20 * (safety.safe_to_execute ? 1 : 0))
  )

  // Justification strength: how well the system supports its own decisions
  const justification_strength = clamp(
    0.40 * reasoning_quality +
    0.30 * coherence_score +
    0.30 * (readiness.readiness_score)
  )

  // Meta score: overall meta‑level evaluation
  const meta_score = clamp(
    0.35 * reasoning_quality +
    0.35 * coherence_score +
    0.20 * justification_strength -
    0.10 * contradiction_score
  )

  const meta_label =
    meta_score >= 0.85 ? "excellent" :
    meta_score >= 0.70 ? "strong" :
    meta_score >= 0.55 ? "moderate" :
    meta_score >= 0.40 ? "weak" :
    "poor"

  const meta_summary = `
Meta Evaluation:
- ${meta_label.toUpperCase()} (${(meta_score * 100).toFixed(1)}%)
- Reasoning quality: ${(reasoning_quality * 100).toFixed(1)}%
- Coherence: ${(coherence_score * 100).toFixed(1)}%
- Contradiction: ${(contradiction_score * 100).toFixed(1)}%
- Justification strength: ${(justification_strength * 100).toFixed(1)}%
`.trim()

  const reasoning = `
Hyper-Meta Evaluation

Inputs:
- Alignment: ${alignment}
- Divergence: ${divergence}
- Global confidence: ${global_conf}
- Safety: ${safety.safe_to_execute}
- Readiness: ${readiness.readiness_score}
- Signal quality: ${telemetry.signal_quality}

Computed:
- Reasoning quality: ${reasoning_quality}
- Coherence score: ${coherence_score}
- Contradiction score: ${contradiction_score}
- Justification strength: ${justification_strength}

Final:
- Meta score: ${meta_score}
- Meta label: ${meta_label}
`.trim()

  return {
    meta_score,
    meta_label,
    reasoning_quality,
    coherence_score,
    contradiction_score,
    justification_strength,
    meta_summary,
    reasoning
  }
}
