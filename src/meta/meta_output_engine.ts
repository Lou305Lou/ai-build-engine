// src/meta/meta_output_engine.ts

import { HyperMetaOutput } from "./hyper_meta_engine"
import { MetaConfidenceOutput } from "./meta_confidence_engine"
import { MetaRoutingOutput } from "./meta_routing_engine"
import { MetaWeightingOutput } from "./meta_weighting_engine"
import { MetaExecutionOutput } from "./meta_execution_engine"

export interface MetaState {
  timestamp: number

  meta_score: number
  meta_label: string

  meta_confidence_score: number
  meta_confidence_label: string

  meta_route_label: string
  meta_position_size: number
  meta_exposure_modifier: number
  meta_hedge_modifier: number

  meta_action: string
  execution_veto: boolean

  meta_stability: number
  meta_volatility: number
  meta_alignment: number
  meta_uncertainty: number

  meta_system_status: string
  summary: string

  hyper: HyperMetaOutput
  meta_confidence: MetaConfidenceOutput
  meta_routing: MetaRoutingOutput
  meta_weighting: MetaWeightingOutput
  meta_execution: MetaExecutionOutput
}

export function computeMetaState(
  hyper: HyperMetaOutput,
  meta_conf: MetaConfidenceOutput,
  meta_routing: MetaRoutingOutput,
  meta_weighting: MetaWeightingOutput,
  meta_execution: MetaExecutionOutput
): MetaState {
  const meta_score = hyper.meta_score
  const meta_conf_score = meta_conf.meta_confidence_score

  const meta_system_status =
    meta_execution.execution_veto ? "halted" :
    meta_conf_score >= 0.80 ? "optimal" :
    meta_conf_score >= 0.60 ? "ready" :
    meta_conf_score >= 0.45 ? "caution" :
    "not_ready"

  const summary = `
Meta-State Summary:
- Meta: ${hyper.meta_label.toUpperCase()} (${(meta_score * 100).toFixed(1)}%)
- Meta Confidence: ${meta_conf.meta_confidence_label.toUpperCase()} (${(meta_conf_score * 100).toFixed(1)}%)
- Meta Route: ${meta_routing.meta_route_label}
- Meta Action: ${meta_execution.meta_action}
- Position Size: ${(meta_weighting.meta_position_size * 100).toFixed(1)}%
- Exposure Mod: ${(meta_weighting.meta_exposure_modifier * 100).toFixed(1)}%
- Hedge Mod: ${(meta_weighting.meta_hedge_modifier * 100).toFixed(1)}%
- System Status: ${meta_system_status}
`.trim()

  return {
    timestamp: Date.now(),

    meta_score,
    meta_label: hyper.meta_label,

    meta_confidence_score: meta_conf_score,
    meta_confidence_label: meta_conf.meta_confidence_label,

    meta_route_label: meta_routing.meta_route_label,
    meta_position_size: meta_weighting.meta_position_size,
    meta_exposure_modifier: meta_weighting.meta_exposure_modifier,
    meta_hedge_modifier: meta_weighting.meta_hedge_modifier,

    meta_action: meta_execution.meta_action,
    execution_veto: meta_execution.execution_veto,

    meta_stability: meta_conf.meta_stability,
    meta_volatility: meta_conf.meta_volatility,
    meta_alignment: meta_conf.meta_alignment,
    meta_uncertainty: meta_conf.meta_uncertainty,

    meta_system_status,
    summary,

    hyper,
    meta_confidence: meta_conf,
    meta_routing,
    meta_weighting,
    meta_execution
  }
}
