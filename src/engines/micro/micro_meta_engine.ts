// src/engines/micro/micro_meta_engine.ts

import { StrategyOutput } from "./micro_strategy_engine"
import { ConfidenceOutput } from "./micro_confidence_engine"
import { DecisionOutput } from "./micro_decision_engine"
import { RoutingOutput } from "./micro_routing_engine"
import { WeightingOutput } from "./micro_weighting_engine"
import { AggregationOutput } from "./micro_aggregation_engine"

export interface MetaInputs {
  strategy: StrategyOutput
  confidence: ConfidenceOutput
  decision: DecisionOutput
  routing: RoutingOutput
  weighting: WeightingOutput
  aggregation: AggregationOutput
}

export interface MetaOutput {
  meta_score: number
  meta_label: string
  consistency: number
  stability: number
  alignment: number
  reasoning: string
}

export function computeMeta(inputs: MetaInputs): MetaOutput {
  const { strategy, confidence, decision, routing, weighting, aggregation } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Consistency: do the micro-engines agree?
  const consistency =
    0.4 * (decision.decision_vector[decision.dominant_decision as keyof typeof decision.decision_vector]) +
    0.3 * confidence.confidence_score +
    0.3 * (aggregation.aggregated_vector[aggregation.dominant_component as keyof typeof aggregation.aggregated_vector])

  // Stability: low variance + stable strategy + low volatility routing
  const stability =
    0.5 * (1 - confidence.variance) +
    0.3 * strategy.strategy_vector.stability_bias +
    0.2 * (routing.route === "wait" ? 1 : 0.5)

  // Alignment: do strategy, decision, and routing logically align?
  const alignment =
    0.4 * (strategy.dominant_strategy === "exploitation" ? 1 : 0.7) +
    0.3 * (decision.dominant_decision === "buy" || decision.dominant_decision === "sell" ? 1 : 0.6) +
    0.3 * (routing.route.startsWith("execute") ? 1 : 0.5)

  const meta_score = clamp(
    0.4 * consistency +
    0.35 * stability +
    0.25 * alignment
  )

  const meta_label =
    meta_score >= 0.85 ? "excellent" :
    meta_score >= 0.70 ? "strong" :
    meta_score >= 0.55 ? "moderate" :
    meta_score >= 0.40 ? "weak" :
    "poor"

  const reasoning = `
Meta Evaluation Report

1. Consistency
- Score: ${consistency.toFixed(4)}
- Based on agreement between decision, confidence, and aggregation.

2. Stability
- Score: ${stability.toFixed(4)}
- Based on variance, strategy stability bias, and routing behavior.

3. Alignment
- Score: ${alignment.toFixed(4)}
- Based on logical coherence between strategy, decision, and routing.

Overall:
- Meta score: ${meta_score.toFixed(4)}
- Meta label: ${meta_label}
`.trim()

  return {
    meta_score: Number(meta_score.toFixed(4)),
    meta_label,
    consistency: Number(consistency.toFixed(4)),
    stability: Number(stability.toFixed(4)),
    alignment: Number(alignment.toFixed(4)),
    reasoning
  }
}
