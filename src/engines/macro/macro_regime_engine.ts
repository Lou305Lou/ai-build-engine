// src/engines/macro/macro_regime_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"
import { MacroRiskOutput } from "./macro_risk_engine"
import { MacroOpportunityOutput } from "./macro_opportunity_engine"
import { MacroTrendOutput } from "./macro_trend_engine"
import { MacroVolatilityOutput } from "./macro_volatility_engine"

export interface MacroRegimeInputs {
  micro: MicroOutput
  macro_risk: MacroRiskOutput
  macro_opportunity: MacroOpportunityOutput
  macro_trend: MacroTrendOutput
  macro_volatility: MacroVolatilityOutput
}

export interface MacroRegimeOutput {
  regime: string
  regime_score: number
  components: {
    risk: number
    opportunity: number
    trend: number
    volatility: number
    micro_final: number
  }
  reasoning: string
}

export function computeMacroRegime(inputs: MacroRegimeInputs): MacroRegimeOutput {
  const { micro, macro_risk, macro_opportunity, macro_trend, macro_volatility } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const risk = clamp(macro_risk.risk_score)
  const opp = clamp(macro_opportunity.opportunity_score)
  const trend = clamp(macro_trend.trend_score)
  const vol = clamp(macro_volatility.volatility_score)
  const micro_final = clamp(micro.final_score)

  // Regime score: high = risk-on, low = risk-off
  const regime_score = clamp(
    0.30 * opp +
    0.25 * trend +
    0.20 * micro_final -
    0.15 * risk -
    0.10 * vol
  )

  let regime = "mixed"

  if (risk >= 0.85 || vol >= 0.85) {
    regime = "panic"
  } else if (regime_score >= 0.80 && vol <= 0.40) {
    regime = "euphoria"
  } else if (regime_score >= 0.65) {
    regime = "risk_on"
  } else if (regime_score <= 0.35) {
    regime = "risk_off"
  } else if (vol >= 0.60 && trend <= 0.45) {
    regime = "transitional"
  } else {
    regime = "mixed"
  }

  const components = {
    risk: Number(risk.toFixed(4)),
    opportunity: Number(opp.toFixed(4)),
    trend: Number(trend.toFixed(4)),
    volatility: Number(vol.toFixed(4)),
    micro_final: Number(micro_final.toFixed(4))
  }

  const reasoning = `
Macro Regime Evaluation

1. Macro Inputs
- Risk score: ${risk}
- Opportunity score: ${opp}
- Trend score: ${trend}
- Volatility score: ${vol}

2. Micro Influence
- Micro final score: ${micro_final}

3. Regime Logic
- High risk or high volatility → panic
- High opportunity + strong trend + low volatility → euphoria
- High regime score → risk_on
- Low regime score → risk_off
- Mixed signals → transitional or mixed

Final:
- Regime score: ${regime_score.toFixed(4)}
- Regime: ${regime}
`.trim()

  return {
    regime,
    regime_score: Number(regime_score.toFixed(4)),
    components,
    reasoning
  }
}
