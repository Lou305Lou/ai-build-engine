// src/engines/micro/micro_strategy_engine.ts

export interface StrategyInputs {
  trend_strength: number
  risk_level: number
  volatility: number
  historical_success: number
  signal_confidence: number
}

export interface StrategyOutput {
  strategy_vector: {
    aggression: number
    caution: number
    exploration: number
    exploitation: number
    stability_bias: number
  }
  dominant_strategy: string
  reasoning: string
}

export function computeStrategy(inputs: StrategyInputs): StrategyOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const trend = clamp(inputs.trend_strength)
  const risk = clamp(inputs.risk_level)
  const vol = clamp(inputs.volatility)
  const hist = clamp(inputs.historical_success)
  const conf = clamp(inputs.signal_confidence)

  // Core strategy components
  const aggression = clamp(trend * conf * (1 - vol))
  const caution = clamp(vol * (1 - risk))
  const exploration = clamp((1 - conf) * (1 - hist))
  const exploitation = clamp(conf * hist)
  const stability_bias = clamp((1 - vol) * hist)

  const strategy_vector = {
    aggression: Number(aggression.toFixed(4)),
    caution: Number(caution.toFixed(4)),
    exploration: Number(exploration.toFixed(4)),
    exploitation: Number(exploitation.toFixed(4)),
    stability_bias: Number(stability_bias.toFixed(4))
  }

  // Determine dominant strategy
  const dominant_strategy = Object.entries(strategy_vector)
    .sort((a, b) => b[1] - a[1])[0][0]

  const reasoning = `
Strategy derived from:
- Trend strength: ${trend}
- Risk level: ${risk}
- Volatility: ${vol}
- Historical success: ${hist}
- Signal confidence: ${conf}

Dominant strategy: ${dominant_strategy}
`.trim()

  return {
    strategy_vector,
    dominant_strategy,
    reasoning
  }
}
