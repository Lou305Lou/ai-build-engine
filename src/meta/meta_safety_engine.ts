// src/meta/meta_safety_engine.ts

import { HyperMetaOutput } from "./hyper_meta_engine"
import { MetaConfidenceOutput } from "./meta_confidence_engine"
import { MetaTelemetryOutput } from "./meta_telemetry_engine"
import { MetaExecutionOutput } from "./meta_execution_engine"

export interface MetaSafetyOutput {
  meta_safe: boolean
  meta_safety_label: string
  meta_kill_switch: boolean
  reasons: string[]
  reasoning: string
}

export function computeMetaSafety(
  hyper: HyperMetaOutput,
  meta_conf: MetaConfidenceOutput,
  meta_telemetry: MetaTelemetryOutput,
  meta_execution: MetaExecutionOutput
): MetaSafetyOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const meta_score = clamp(hyper.meta_score)
  const meta_conf_score = clamp(meta_conf.meta_confidence_score)
  const meta_uncertainty = clamp(meta_conf.meta_uncertainty)
  const meta_volatility = clamp(meta_conf.meta_volatility)
  const contradiction = clamp(hyper.contradiction_score)

  const reasons: string[] = []

  // Thresholds
  const META_CONF_MIN = 0.40
  const META_SCORE_MIN = 0.45
  const UNCERTAINTY_MAX = 0.70
  const VOLATILITY_MAX = 0.75
  const CONTRADICTION_MAX = 0.65

  // Kill-switch conditions
  const meta_kill_switch =
    meta_conf_score < 0.25 ||
    meta_score < 0.30 ||
    meta_uncertainty > 0.85 ||
    meta_volatility > 0.85 ||
    contradiction > 0.80 ||
    meta_execution.execution_veto

  if (meta_kill_switch) {
    reasons.push("Meta kill-switch triggered due to extreme instability.")
  }

  // Additional safety checks
  if (meta_conf_score < META_CONF_MIN) {
    reasons.push("Meta confidence below minimum threshold.")
  }

  if (meta_score < META_SCORE_MIN) {
    reasons.push("Meta score below minimum threshold.")
  }

  if (meta_uncertainty > UNCERTAINTY_MAX) {
    reasons.push("Meta uncertainty too high.")
  }

  if (meta_volatility > VOLATILITY_MAX) {
    reasons.push("Meta volatility exceeds safe limits.")
  }

  if (contradiction > CONTRADICTION_MAX) {
    reasons.push("Meta contradiction pressure too high.")
  }

  // Final safety decision
  const meta_safe =
    !meta_kill_switch &&
    meta_conf_score >= META_CONF_MIN &&
    meta_score >= META_SCORE_MIN &&
    meta_uncertainty <= UNCERTAINTY_MAX &&
    meta_volatility <= VOLATILITY_MAX &&
    contradiction <= CONTRADICTION_MAX

  const meta_safety_label =
    meta_kill_switch ? "unsafe" :
    meta_safe ? "safe" :
    "caution"

  const reasoning = `
Meta Safety Evaluation

Inputs:
- Meta score: ${meta_score}
- Meta confidence: ${meta_conf_score}
- Meta uncertainty: ${meta_uncertainty}
- Meta volatility: ${meta_volatility}
- Contradiction: ${contradiction}
- Meta execution veto: ${meta_execution.execution_veto}

Thresholds:
- Meta confidence >= ${META_CONF_MIN}
- Meta score >= ${META_SCORE_MIN}
- Uncertainty <= ${UNCERTAINTY_MAX}
- Volatility <= ${VOLATILITY_MAX}
- Contradiction <= ${CONTRADICTION_MAX}

Kill-switch: ${meta_kill_switch}

Final:
- Meta safe: ${meta_safe}
- Safety label: ${meta_safety_label}
- Reasons: ${reasons.length > 0 ? reasons.join("; ") : "None"}
`.trim()

  return {
    meta_safe,
    meta_safety_label,
    meta_kill_switch,
    reasons,
    reasoning
  }
}
