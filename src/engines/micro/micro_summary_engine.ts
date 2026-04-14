// src/engines/micro/micro_summary_engine.ts

import { StrategyOutput } from "./micro_strategy_engine"
import { ConfidenceOutput } from "./micro_confidence_engine"
import { DecisionOutput } from "./micro_decision_engine"
import { RoutingOutput } from "./micro_routing_engine"
import { WeightingOutput } from "./micro_weighting_engine"
import { AggregationOutput } from "./micro_aggregation_engine"

export interface SummaryInputs {
  strategy: StrategyOutput
  confidence: ConfidenceOutput
  decision: DecisionOutput
  routing: RoutingOutput
  weighting: WeightingOutput
  aggregation: AggregationOutput
}

export interface SummaryOutput {
  summary: string
  key_points: string[]
}

export function computeSummary(inputs: SummaryInputs): SummaryOutput {
  const { strategy, confidence, decision, routing, weighting, aggregation } = inputs

  const summary = `
Micro Summary Report

1. Strategy Analysis
- Dominant strategy: ${strategy.dominant_strategy}
- Strategy vector: ${JSON.stringify(strategy.strategy_vector)}

2. Confidence Assessment
- Confidence score: ${confidence.confidence_score}
- Confidence label: ${confidence.confidence_label}
- Variance: ${confidence.variance}

3. Decision Outcome
- Dominant decision: ${decision.dominant_decision}
- Decision vector: ${JSON.stringify(decision.decision_vector)}

4. Routing Directive
- Route selected: ${routing.route}

5. Weighting Profile
- Weights: ${JSON.stringify(weighting.weights)}

6. Aggregated Intelligence
- Dominant component: ${aggregation.dominant_component}
- Aggregated vector: ${JSON.stringify(aggregation.aggregated_vector)}

Overall Interpretation:
The system selected "${decision.dominant_decision}" with a confidence level of "${confidence.confidence_label}" and routed the action to "${routing.route}". The aggregated intelligence indicates that "${aggregation.dominant_component}" was the strongest contributing factor.
`.trim()

  const key_points = [
    `Strategy: ${strategy.dominant_strategy}`,
    `Confidence: ${confidence.confidence_label} (${confidence.confidence_score})`,
    `Decision: ${decision.dominant_decision}`,
    `Route: ${routing.route}`,
    `Top Component: ${aggregation.dominant_component}`
  ]

  return {
    summary,
    key_points
  }
}
