// src/meta/meta_execution_engine.ts

import { HyperMetaOutput } from "./hyper_meta_engine"
import { MetaConfidenceOutput } from "./meta_confidence_engine"
import { MetaRoutingOutput } from "./meta_routing_engine"
import { GlobalExecutionOutput } from "../fusion/global_execution_engine"
import { GlobalState } from "../fusion/global_state_engine"

export interface MetaExecutionOutput {
  meta_action: string
  action_dampening: number
  action_reinforcement: number
  execution_veto: boolean
  execution_confidence: number
  override_global_action: boolean
  reasoning: string
}

export function computeMetaExecution(
  state: GlobalState,
  hyper: HyperMetaOutput,
  meta_conf: MetaConfidenceOutput,
  meta_routing: MetaRoutingOutput,
  global_execution: GlobalExecutionOutput
): MetaExecutionOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const meta_score = clamp(hyper.meta_score)
  const meta_conf_score = clamp(meta_conf.meta_confidence_score)
  const divergence = clamp(state.intelligence.fusion.divergence)
  const volatility = clamp(state.telemetry.volatility_stress)
  const global_action = global_execution.action

  // Execution confidence: how confident the meta-layer is in executing the global action
  const execution_confidence = Number(
    clamp(
      0.40 * meta_conf_score +
      0.30 * meta_score +
      0.30 * (1 - divergence)
    ).toFixed(4)
  )

  // Action dampening: reduces execution intensity when meta-layer is uncertain
  const action_dampening = Number(
    clamp(
      1 -
      (0.50 * meta_conf_score +
       0.30 * meta_score -
       0.20 * divergence)
    ).toFixed(4)
  )

  // Action reinforcement: increases execution intensity when meta-layer is confident
  const action_reinforcement = Number(
    clamp(
      0.50 * meta_conf_score +
      0.30 * meta_score -
      0.20 * volatility
    ).toFixed(4)
  )

  // Execution veto: meta-layer blocks execution entirely
  const execution_veto =
    meta_conf_score < 0.40 ||
    meta_score < 0.45 ||
    divergence > 0.65 ||
    volatility > 0.70 ||
    meta_routing.caution_flag

  // Meta action label
  const meta_action =
    execution_veto ? "block" :
    execution_confidence >= 0.80 ? "reinforce" :
    execution_confidence >= 0.60 ? "follow" :
    execution_confidence >= 0.45 ? "soften" :
    "protect"

  // Override global action?
  const override_global_action =
    execution_veto ||
    meta_action === "protect" ||
    meta_action === "soften"

  const reasoning = `
Meta-Execution Evaluation

Inputs:
- Meta score: ${meta_score}
- Meta confidence: ${meta_conf_score}
- Divergence: ${divergence}
- Volatility: ${volatility}
- Global action: ${global_action}

Computed:
- Execution confidence: ${execution_confidence}
- Action dampening: ${action_dampening}
- Action reinforcement: ${action_reinforcement}
- Execution veto: ${execution_veto}

Final:
- Meta action: ${meta_action}
- Override global action: ${override_global_action}
`.trim()

  return {
    meta_action,
    action_dampening,
    action_reinforcement,
    execution_veto,
    execution_confidence,
    override_global_action,
    reasoning
  }
}
