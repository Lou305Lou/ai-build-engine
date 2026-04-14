// src/meta/meta_routing_engine.ts

import { HyperMetaOutput } from "./hyper_meta_engine"
import { MetaConfidenceOutput } from "./meta_confidence_engine"
import { GlobalRoutingOutput } from "../fusion/global_routing_engine"
import { GlobalState } from "../fusion/global_state_engine"

export interface MetaRoutingOutput {
  meta_route_label: string
  execution_dampening: number
  exposure_adjustment: number
  hedge_adjustment: number
  caution_flag: boolean
  override_global_route: boolean
  reasoning: string
}

export function computeMetaRouting(
  state: GlobalState,
  hyper: HyperMetaOutput,
  meta_conf: MetaConfidenceOutput,
  global_routing: GlobalRoutingOutput
): MetaRoutingOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const meta_score = clamp(hyper.meta_score)
  const meta_conf_score = clamp(meta_conf.meta_confidence_score)
  const divergence = clamp(state.intelligence.fusion.divergence)
  const volatility = clamp(state.telemetry.volatility_stress)

  // Meta‑level caution flag
  const caution_flag =
    meta_conf_score < 0.45 ||
    meta_score < 0.50 ||
    divergence > 0.60 ||
    volatility > 0.65

  // Execution dampening: reduces aggressiveness when meta‑layer is uncertain
  const execution_dampening = Number(
    clamp(
      1 -
      (0.50 * meta_conf_score +
       0.30 * meta_score -
       0.20 * divergence)
    ).toFixed(4)
  )

  // Exposure adjustment: reduces exposure when meta‑layer detects instability
  const exposure_adjustment = Number(
    clamp(
      1 -
      (0.40 * meta_conf_score +
       0.30 * meta_score -
       0.30 * volatility)
    ).toFixed(4)
  )

  // Hedge adjustment: increases hedge when meta‑layer detects uncertainty
  const hedge_adjustment = Number(
    clamp(
      0.40 * (1 - meta_conf_score) +
      0.30 * divergence +
      0.30 * volatility
    ).toFixed(4)
  )

  // Meta‑route label
  const meta_route_label =
    meta_conf_score >= 0.80 && meta_score >= 0.75 ? "reinforce_global_route" :
    meta_conf_score >= 0.60 ? "follow_global_route" :
    meta_conf_score >= 0.45 ? "cautious_route" :
    "protective_route"

  // Override global route?
  const override_global_route =
    meta_route_label === "protective_route" ||
    caution_flag

  const reasoning = `
Meta-Routing Evaluation

Inputs:
- Meta score: ${meta_score}
- Meta confidence: ${meta_conf_score}
- Divergence: ${divergence}
- Volatility: ${volatility}

Meta Decisions:
- Caution flag: ${caution_flag}
- Execution dampening: ${execution_dampening}
- Exposure adjustment: ${exposure_adjustment}
- Hedge adjustment: ${hedge_adjustment}
- Meta route label: ${meta_route_label}
- Override global route: ${override_global_route}

Global Route:
- Original route: ${global_routing.route_label}
`.trim()

  return {
    meta_route_label,
    execution_dampening,
    exposure_adjustment,
    hedge_adjustment,
    caution_flag,
    override_global_route,
    reasoning
  }
}
