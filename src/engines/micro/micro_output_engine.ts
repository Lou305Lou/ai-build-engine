// src/engines/micro/micro_output_engine.ts

import { StrategyOutput } from "./micro_strategy_engine"
import { ConfidenceOutput } from "./micro_confidence_engine"
import { DecisionOutput } from "./micro_decision_engine"
import { RoutingOutput } from "./micro_routing_engine"
import { WeightingOutput } from "./micro_weighting_engine"
import { AggregationOutput } from "./micro_aggregation_engine"
import { SummaryOutput } from "./micro_summary_engine"
import { MetaOutput } from "./micro_meta_engine"

export interface MicroOutputInputs {
  strategy: StrategyOutput
  confidence: ConfidenceOutput
  decision: DecisionOutput
  routing: RoutingOutput
  weighting: WeightingOutput
  aggregation: AggregationOutput
  summary: SummaryOutput
  meta: MetaOutput
}

export interface MicroOutput {
  micro_intelligence: {
    strategy: StrategyOutput
    confidence: ConfidenceOutput
    decision: DecisionOutput
    routing: RoutingOutput
    weighting: WeightingOutput
    aggregation: AggregationOutput
    summary: SummaryOutput
    meta: MetaOutput
  }
  final_label: string
  final_score: number
  reasoning: string
}

export function computeMicroOutput(inputs: MicroOutputInputs): MicroOutput {
  const { strategy, confidence, decision, routing, weighting, aggregation, summary, meta } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Final score is a weighted blend of the most important micro signals
  const final_score = clamp(
    0.35 * confidence.confidence_score +
    0.25 * aggregation.aggregated_vector[aggregation.dominant_component as keyof typeof aggregation.aggregated_vector] +
    0.20 * meta.meta_score +
    0.20 * decision.decision_vector[decision.dominant_decision as keyof typeof decision.decision_vector]
  )

  const final_label =
    final_score >= 0.85 ? "very_strong" :
    final_score >= 0.70 ? "strong" :
    final_score >= 0.55 ? "moderate" :
    final_score >= 0.40 ? "weak" :
    "very_weak"

  const reasoning = `
Final Micro Output

- Final score: ${final_score.toFixed(4)}
- Final label: ${final_label}

Derived from:
- Confidence score: ${confidence.confidence_score}
- Dominant aggregated component: ${aggregation.dominant_component}
- Meta score: ${meta.meta_score}
- Dominant decision: ${decision.dominant_decision}

Summary:
${summary.summary}
`.trim()

  return {
    micro_intelligence: {
      strategy,
      confidence,
      decision,
      routing,
      weighting,
      aggregation,
      summary,
      meta
    },
    final_label,
    final_score: Number(final_score.toFixed(4)),
    reasoning
  }
}
