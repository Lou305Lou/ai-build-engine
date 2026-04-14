// src/engines/micro/micro_aggregation_engine.ts

import { StrategyOutput } from "./micro_strategy_engine"
import { ConfidenceOutput } from "./micro_confidence_engine"
import { DecisionOutput } from "./micro_decision_engine"
import { RoutingOutput } from "./micro_routing_engine"
import { WeightingOutput } from "./micro_weighting_engine"

export interface AggregationInputs {
  strategy: StrategyOutput
  confidence: ConfidenceOutput
  decision: DecisionOutput
  routing: RoutingOutput
  weighting: WeightingOutput
}

export interface AggregationOutput {
  aggregated_vector: {
    strategy_component: number
    confidence_component: number
    decision_component: number
    routing_component: number
    safety_component: number
  }
  dominant_component: string
  reasoning: string
}

export function computeAggregation(inputs: AggregationInputs): AggregationOutput {
  const { strategy, confidence, decision, routing, weighting } = inputs

  const w = weighting.weights

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Convert routing to a numeric signal
  const routing_map: Record<string, number> = {
    execute_buy: 1.0,
    execute_sell: 0.8,
    explore_opportunities: 0.6,
    wait: 0.4,
    avoid_market: 0.2,
    escalate_to_macro: 0.1
  }

  const routing_value = routing_map[routing.route] ?? 0.3

  // Weighted components
  const strategy_component = clamp(
    w.strategy_weight *
    strategy.strategy_vector.exploitation
  )

  const confidence_component = clamp(
    w.confidence_weight *
    confidence.confidence_score
  )

  const decision_component = clamp(
    w.decision_weight *
    decision.decision_vector[decision.dominant_decision as keyof typeof decision.decision_vector]
  )

  const routing_component = clamp(
    routing_value *
    (1 - w.safety_weight)
  )

  const safety_component = clamp(
    w.safety_weight *
    confidence.variance
  )

  const aggregated_vector = {
    strategy_component: Number(strategy_component.toFixed(4)),
    confidence_component: Number(confidence_component.toFixed(4)),
    decision_component: Number(decision_component.toFixed(4)),
    routing_component: Number(routing_component.toFixed(4)),
    safety_component: Number(safety_component.toFixed(4))
  }

  const dominant_component = Object.entries(aggregated_vector)
    .sort((a, b) => b[1] - a[1])[0][0]

  const reasoning = `
Aggregation derived from:
- Strategy exploitation: ${strategy.strategy_vector.exploitation}
- Confidence score: ${confidence.confidence_score}
- Dominant decision: ${decision.dominant_decision}
- Routing: ${routing.route}
- Weighting vector: ${JSON.stringify(w)}

Final aggregated vector: ${JSON.stringify(aggregated_vector)}
Dominant component: ${dominant_component}
`.trim()

  return {
    aggregated_vector,
    dominant_component,
    reasoning
  }
}
