// src/engines/macro/macro_opportunity_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"
import { MacroRiskOutput } from "./macro_risk_engine"

export interface MacroOpportunityInputs {
  micro: MicroOutput
  macro_risk: MacroRiskOutput
  trend_strength: number
  liquidity_expansion: number
  volatility_compression: number
  macro_cycle_position: number
  opportunity_asymmetry: number
}

export interface MacroOpportunityOutput {
  opportunity_score: number
  opportunity_label: string
  components: {
    micro_signal: number
    trend_component: number
    liquidity_component: number
    volatility_component: number
    cycle_component: number
    asymmetry_component: number
    risk_inverse: number
  }
  reasoning: string
}

export function computeMacroOpportunity(inputs: MacroOpportunityInputs): MacroOpportunityOutput {
  const {
    micro,
    macro_risk,
    trend_strength,
    liquidity_expansion,
    volatility_compression,
    macro_cycle_position,
    opportunity_asymmetry
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const micro_signal = clamp(
    micro.micro_intelligence.decision.decision_vector.buy -
    micro.micro_intelligence.decision.decision_vector.sell
  )

  const trend = clamp(trend_strength)
  const liq = clamp(liquidity_expansion)
  const vol_comp = clamp(volatility_compression)
  const cyc = clamp(macro_cycle_position)
  const asym = clamp(opportunity_asymmetry)

  const risk_inverse = clamp(1 - macro_risk.risk_score)

  // Core macro opportunity formula
  const opportunity_score = clamp(
    0.25 * trend +
    0.20 * liq +
    0.15 * vol_comp +
    0.15 * asym +
    0.15 * cyc +
    0.10 * micro_signal +
    0.10 * risk_inverse
  )

  const opportunity_label =
    opportunity_score >= 0.85 ? "exceptional" :
    opportunity_score >= 0.70 ? "strong" :
    opportunity_score >= 0.55 ? "moderate" :
    opportunity_score >= 0.40 ? "weak" :
    "minimal"

  const components = {
    micro_signal: Number(micro_signal.toFixed(4)),
    trend_component: Number(trend.toFixed(4)),
    liquidity_component: Number(liq.toFixed(4)),
    volatility_component: Number(vol_comp.toFixed(4)),
    cycle_component: Number(cyc.toFixed(4)),
    asymmetry_component: Number(asym.toFixed(4)),
    risk_inverse: Number(risk_inverse.toFixed(4))
  }

  const reasoning = `
Macro Opportunity Evaluation

1. Micro Layer Influence
- Micro buy-sell signal: ${micro_signal}

2. Macro Opportunity Drivers
- Trend strength: ${trend}
- Liquidity expansion: ${liq}
- Volatility compression: ${vol_comp}
- Macro cycle position: ${cyc}
- Opportunity asymmetry: ${asym}

3. Risk Adjustment
- Inverse macro risk: ${risk_inverse}

Final:
- Opportunity score: ${opportunity_score.toFixed(4)}
- Opportunity label: ${opportunity_label}
`.trim()

  return {
    opportunity_score: Number(opportunity_score.toFixed(4)),
    opportunity_label,
    components,
    reasoning
  }
}
