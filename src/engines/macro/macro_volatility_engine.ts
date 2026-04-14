// src/engines/macro/macro_volatility_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"
import { MacroRiskOutput } from "./macro_risk_engine"
import { MacroOpportunityOutput } from "./macro_opportunity_engine"
import { MacroTrendOutput } from "./macro_trend_engine"

export interface MacroVolatilityInputs {
  micro: MicroOutput
  macro_risk: MacroRiskOutput
  macro_opportunity: MacroOpportunityOutput
  macro_trend: MacroTrendOutput
  volatility_expansion: number
  volatility_compression: number
  volatility_clustering: number
  shock_probability: number
  liquidity_fragility: number
}

export interface MacroVolatilityOutput {
  volatility_score: number
  volatility_label: string
  shock_probability: number
  regime: string
  components: {
    expansion: number
    compression: number
    clustering: number
    shock: number
    liquidity: number
    trend_component: number
    risk_component: number
  }
  reasoning: string
}

export function computeMacroVolatility(inputs: MacroVolatilityInputs): MacroVolatilityOutput {
  const {
    micro,
    macro_risk,
    macro_opportunity,
    macro_trend,
    volatility_expansion,
    volatility_compression,
    volatility_clustering,
    shock_probability,
    liquidity_fragility
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const exp = clamp(volatility_expansion)
  const comp = clamp(volatility_compression)
  const clust = clamp(volatility_clustering)
  const shock = clamp(shock_probability)
  const liq = clamp(liquidity_fragility)

  const trend_component = clamp(1 - macro_trend.trend_score)
  const risk_component = clamp(macro_risk.risk_score)

  // Core macro volatility formula
  const volatility_score = clamp(
    0.25 * exp +
    0.20 * clust +
    0.20 * shock +
    0.15 * liq +
    0.10 * trend_component +
    0.10 * risk_component -
    0.10 * comp
  )

  const volatility_label =
    volatility_score >= 0.85 ? "extreme" :
    volatility_score >= 0.70 ? "high" :
    volatility_score >= 0.55 ? "elevated" :
    volatility_score >= 0.40 ? "moderate" :
    "low"

  const regime =
    volatility_score >= 0.75 ? "expansion" :
    volatility_score >= 0.55 ? "unstable" :
    volatility_score >= 0.40 ? "neutral" :
    "compression"

  const components = {
    expansion: Number(exp.toFixed(4)),
    compression: Number(comp.toFixed(4)),
    clustering: Number(clust.toFixed(4)),
    shock: Number(shock.toFixed(4)),
    liquidity: Number(liq.toFixed(4)),
    trend_component: Number(trend_component.toFixed(4)),
    risk_component: Number(risk_component.toFixed(4))
  }

  const reasoning = `
Macro Volatility Evaluation

1. Volatility Structure
- Expansion: ${exp}
- Compression: ${comp}
- Clustering: ${clust}

2. Shock & Liquidity
- Shock probability: ${shock}
- Liquidity fragility: ${liq}

3. Macro Influence
- Trend drag: ${trend_component}
- Risk amplification: ${risk_component}

Final:
- Volatility score: ${volatility_score.toFixed(4)}
- Volatility label: ${volatility_label}
- Regime: ${regime}
`.trim()

  return {
    volatility_score: Number(volatility_score.toFixed(4)),
    volatility_label,
    shock_probability: Number(shock.toFixed(4)),
    regime,
    components,
    reasoning
  }
}
