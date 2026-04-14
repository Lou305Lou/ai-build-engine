// src/meta/meta_weighting_engine.ts

import { HyperMetaOutput } from "./hyper_meta_engine"
import { MetaConfidenceOutput } from "./meta_confidence_engine"
import { MetaRoutingOutput } from "./meta_routing_engine"
import { GlobalWeightingOutput } from "../fusion/global_weighting_engine"
import { GlobalState } from "../fusion/global_state_engine"

export interface MetaWeightingOutput {
  meta_position_size: number
  meta_exposure_modifier: number
  meta_hedge_modifier: number
  conviction_adjustment: number
  risk_dampening: number
  override_global_weighting: boolean
  reasoning: string
}

export function computeMetaWeighting(
  state: GlobalState,
  hyper: HyperMetaOutput,
  meta_conf: MetaConfidenceOutput,
  meta_routing: MetaRoutingOutput,
  global_weighting: GlobalWeightingOutput
): MetaWeightingOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const meta_score = clamp(hyper.meta_score)
  const meta_conf_score = clamp(meta_conf.meta_confidence_score)
  const divergence = clamp(state.intelligence.fusion.divergence)
  const volatility = clamp(state.telemetry.volatility_stress)
  const global_position = clamp(global_weighting.position_size)

  // Risk dampening increases when meta‑layer is uncertain
  const risk_dampening = Number(
    clamp(
      0.40 * (1 - meta_conf_score) +
      0.30 * divergence +
      0.30 * volatility
    ).toFixed(4)
  )

  // Conviction adjustment increases when meta‑layer is confident
  const conviction_adjustment = Number(
    clamp(
      0.50 * meta_conf_score +
      0.30 * meta_score -
      0.20 * divergence
    ).toFixed(4)
  )

  // Meta‑position size: global position scaled by meta‑layer
  const meta_position_size = Number(
    clamp(
      global_position *
      (0.60 * conviction_adjustment +
       0.40 * (1 - risk_dampening))
    ).toFixed(4)
  )

  // Exposure modifier: meta‑layer adjusts global exposure
  const meta_exposure_modifier = Number(
    clamp(
      (1 - risk_dampening) *
      (0.5 + 0.5 * meta_conf_score)
    ).toFixed(4)
  )

  // Hedge modifier: meta‑layer increases hedge when uncertain
  const meta_hedge_modifier = Number(
    clamp(
      0.50 * risk_dampening +
      0.30 * divergence +
      0.20 * volatility
    ).toFixed(4)
  )

  // Override global weighting?
  const override_global_weighting =
    meta_conf_score < 0.45 ||
    meta_score < 0.50 ||
    divergence > 0.60 ||
    volatility > 0.65 ||
    meta_routing.override_global_route

  const reasoning = `
Meta-Weighting Evaluation

Inputs:
- Meta score: ${meta_score}
- Meta confidence: ${meta_conf_score}
- Divergence: ${divergence}
- Volatility: ${volatility}
- Global position: ${global_position}

Computed:
- Risk dampening: ${risk_dampening}
- Conviction adjustment: ${conviction_adjustment}
- Meta position size: ${meta_position_size}
- Meta exposure modifier: ${meta_exposure_modifier}
- Meta hedge modifier: ${meta_hedge_modifier}

Final:
- Override global weighting: ${override_global_weighting}
`.trim()

  return {
    meta_position_size,
    meta_exposure_modifier,
    meta_hedge_modifier,
    conviction_adjustment,
    risk_dampening,
    override_global_weighting,
    reasoning
  }
}
