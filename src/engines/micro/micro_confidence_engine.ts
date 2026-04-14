// src/engines/micro/micro_confidence_engine.ts

export interface ConfidenceFactors {
  data_quality: number
  model_agreement: number
  historical_alignment: number
  volatility: number
  signal_strength: number
}

export interface ConfidenceOutput {
  confidence_score: number
  confidence_label: string
  variance: number
  reasoning: string
  factors: ConfidenceFactors
}

export function computeConfidence(factors: ConfidenceFactors): ConfidenceOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const dq = clamp(factors.data_quality)
  const ma = clamp(factors.model_agreement)
  const ha = clamp(factors.historical_alignment)
  const vol = clamp(factors.volatility)
  const ss = clamp(factors.signal_strength)

  const confidence_score =
    0.25 * dq +
    0.25 * ma +
    0.20 * ha +
    0.15 * (1 - vol) +
    0.15 * ss

  const variance = 1 - ma

  const label =
    confidence_score >= 0.85 ? "very_high" :
    confidence_score >= 0.70 ? "high" :
    confidence_score >= 0.55 ? "medium" :
    confidence_score >= 0.40 ? "low" :
    "very_low"

  const reasoning = `
Confidence driven by:
- Data quality: ${dq}
- Model agreement: ${ma}
- Historical alignment: ${ha}
- Volatility impact: ${vol}
- Signal strength: ${ss}

Overall: ${label} confidence.
`.trim()

  return {
    confidence_score: Number(confidence_score.toFixed(4)),
    confidence_label: label,
    variance: Number(variance.toFixed(4)),
    reasoning,
    factors: {
      data_quality: dq,
      model_agreement: ma,
      historical_alignment: ha,
      volatility: vol,
      signal_strength: ss
    }
  }
}

