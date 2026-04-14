// src/engines/micro/micro_weighting_engine.ts

import { StrategyOutput } from "./micro_strategy_engine"
import { ConfidenceOutput } from "./micro_confidence_engine"
import { DecisionOutput } from "./micro_decision_engine"

export interface WeightingInputs {
  strategy: StrategyOutput
  confidence: ConfidenceOutput
  decision: DecisionOutput
  raw_signal: number
  risk_level: number
  volatility: number
}

export interface WeightingOutput {
  weights: {
    strategy_weight: number
    confidence_weight: number
    decision_weight: number
    signal_weight: number
    safety_weight: number
  }
  reasoning: string
}

export function computeWeighting(inputs: WeightingInputs): WeightingOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const { strategy, confidence, decision } = inputs

  const signal = clamp(inputs.raw_signal)
  const risk = clamp(inputs.risk_level)
  const vol = clamp(inputs.volatility)
  const conf = clamp(confidence.confidence_score)

  const hist = strategy.strategy_vector.stability_bias

  // Core weight components
  const strategy_weight = clamp(hist * (1 - vol))
  const confidence_weight = clamp(conf)
  const decision_weight = clamp(conf * (1 - risk))
  const signal_weight = clamp(signal * (1 - vol))
  const safety_weight = clamp(risk * vol)

  const weights = {
    strategy_weight: Number(strategy_weight.toFixed(4)),
    confidence_weight: Number(confidence_weight.toFixed(4)),
    decision_weight: Number(decision_weight.toFixed(4)),
    signal_weight: Number(signal_weight.toFixed(4)),
    safety_weight: Number(safety_weight.toFixed(4))
  }

  const reasoning = `
Weighting derived from:
- Raw signal: ${signal}
- Risk level: ${risk}
- Volatility: ${vol}
- Confidence score: ${conf}
- Strategy stability bias: ${hist}
- Dominant decision: ${decision.dominant_decision}

Final weights: ${JSON.stringify(weights)}
`.trim()

  return {
    weights,
    reasoning
  }
}
