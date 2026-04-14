// src/engines/macro/macro_risk_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"

export interface MacroRiskInputs {
  micro: MicroOutput
  market_volatility: number
  liquidity_index: number
  macro_cycle_position: number
  systemic_risk_index: number
}

export interface MacroRiskOutput {
  risk_score: number
  risk_label: string
  components: {
    micro_confidence: number
    micro_variance: number
    volatility_component: number
    liquidity_component: number
    cycle_component: number
    systemic_component: number
  }
  reasoning: string
}

export function computeMacroRisk(inputs: MacroRiskInputs): MacroRiskOutput {
  const { micro, market_volatility, liquidity_index, macro_cycle_position, systemic_risk_index } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const micro_conf = clamp(micro.micro_intelligence.confidence.confidence_score)
  const micro_var = clamp(micro.micro_intelligence.confidence.variance)

  const vol = clamp(market_volatility)
  const liq = clamp(liquidity_index)
  const cyc = clamp(macro_cycle_position)
  const sys = clamp(systemic_risk_index)

  // Core macro risk formula
  const risk_score = clamp(
    0.25 * vol +
    0.20 * (1 - liq) +
    0.20 * sys +
    0.15 * cyc +
    0.10 * (1 - micro_conf) +
    0.10 * micro_var
  )

  const risk_label =
    risk_score >= 0.85 ? "extreme" :
    risk_score >= 0.70 ? "high" :
    risk_score >= 0.55 ? "elevated" :
    risk_score >= 0.40 ? "moderate" :
    "low"

  const components = {
    micro_confidence: Number(micro_conf.toFixed(4)),
    micro_variance: Number(micro_var.toFixed(4)),
    volatility_component: Number(vol.toFixed(4)),
    liquidity_component: Number((1 - liq).toFixed(4)),
    cycle_component: Number(cyc.toFixed(4)),
    systemic_component: Number(sys.toFixed(4))
  }

  const reasoning = `
Macro Risk Evaluation

1. Micro Layer Influence
- Micro confidence: ${micro_conf}
- Micro variance: ${micro_var}

2. Market Conditions
- Volatility: ${vol}
- Liquidity stress: ${1 - liq}
- Macro cycle position: ${cyc}
- Systemic risk index: ${sys}

Final:
- Risk score: ${risk_score.toFixed(4)}
- Risk label: ${risk_label}
`.trim()

  return {
    risk_score: Number(risk_score.toFixed(4)),
    risk_label,
    components,
    reasoning
  }
}
