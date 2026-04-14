// src/engines/micro/micro_routing_engine.ts

import { DecisionOutput } from "./micro_decision_engine"
import { StrategyOutput } from "./micro_strategy_engine"
import { ConfidenceOutput } from "./micro_confidence_engine"

export interface RoutingInputs {
  decision: DecisionOutput
  strategy: StrategyOutput
  confidence: ConfidenceOutput
  risk_level: number
  volatility: number
}

export interface RoutingOutput {
  route: string
  reasoning: string
}

export function computeRouting(inputs: RoutingInputs): RoutingOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const { decision, strategy, confidence } = inputs

  const risk = clamp(inputs.risk_level)
  const vol = clamp(inputs.volatility)
  const conf = confidence.confidence_score
  const dominant = decision.dominant_decision

  let route = "wait"

  // Routing logic
  if (dominant === "buy" && conf > 0.65 && vol < 0.5) {
    route = "execute_buy"
  } else if (dominant === "sell" && conf > 0.65) {
    route = "execute_sell"
  } else if (dominant === "avoid" || risk > 0.7 || vol > 0.7) {
    route = "avoid_market"
  } else if (dominant === "explore" && conf < 0.5) {
    route = "explore_opportunities"
  } else if (conf < 0.3) {
    route = "escalate_to_macro"
  } else {
    route = "wait"
  }

  const reasoning = `
Routing decision based on:
- Dominant decision: ${dominant}
- Confidence score: ${conf}
- Risk level: ${risk}
- Volatility: ${vol}
- Strategy vector: ${JSON.stringify(strategy.strategy_vector)}

Selected route: ${route}
`.trim()

  return {
    route,
    reasoning
  }
}
