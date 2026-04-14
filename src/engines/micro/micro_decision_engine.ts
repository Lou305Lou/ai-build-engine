// src/engines/micro/micro_decision_engine.ts

import { StrategyOutput } from "./micro_strategy_engine"
import { ConfidenceOutput } from "./micro_confidence_engine"

export interface DecisionInputs {
  strategy: StrategyOutput
  confidence: ConfidenceOutput
  raw_signal: number
  risk_level: number
  volatility: number
}

export interface DecisionOutput {
  decision_vector: {
    buy: number
    sell: number
    hold: number
    avoid: number
    explore: number
  }
  dominant_decision: string
  reasoning: string
}

export function computeDecision(inputs: DecisionInputs): DecisionOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const { strategy, confidence } = inputs

  const signal = clamp(inputs.raw_signal)
  const risk = clamp(inputs.risk_level)
  const vol = clamp(inputs.volatility)

  const { aggression, caution, exploration, exploitation, stability_bias } =
    strategy.strategy_vector

  const conf = confidence.confidence_score

  // Core decision components
  const buy = clamp(
    aggression * signal * conf * (1 - vol) + exploitation * signal
  )

  const sell = clamp(
    caution * vol * (1 - signal) * conf
  )

  const hold = clamp(
    stability_bias * conf * (1 - vol)
  )

  const avoid = clamp(
    vol * risk * (1 - conf)
  )

  const explore = clamp(
    exploration * (1 - conf) * (1 - risk)
  )

  const decision_vector = {
    buy: Number(buy.toFixed(4)),
    sell: Number(sell.toFixed(4)),
    hold: Number(hold.toFixed(4)),
    avoid: Number(avoid.toFixed(4)),
    explore: Number(explore.toFixed(4))
  }

  const dominant_decision = Object.entries(decision_vector)
    .sort((a, b) => b[1] - a[1])[0][0]

  const reasoning = `
Decision derived from:
- Raw signal: ${signal}
- Risk level: ${risk}
- Volatility: ${vol}
- Strategy vector: ${JSON.stringify(strategy.strategy_vector)}
- Confidence score: ${conf}

Dominant decision: ${dominant_decision}
`.trim()

  return {
    decision_vector,
    dominant_decision,
    reasoning
  }
}
