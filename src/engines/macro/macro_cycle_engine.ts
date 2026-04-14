// src/engines/macro/macro_cycle_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"
import { MacroRiskOutput } from "./macro_risk_engine"
import { MacroOpportunityOutput } from "./macro_opportunity_engine"
import { MacroTrendOutput } from "./macro_trend_engine"
import { MacroVolatilityOutput } from "./macro_volatility_engine"
import { MacroRegimeOutput } from "./macro_regime_engine"

export interface MacroCycleInputs {
  micro: MicroOutput
  macro_risk: MacroRiskOutput
  macro_opportunity: MacroOpportunityOutput
  macro_trend: MacroTrendOutput
  macro_volatility: MacroVolatilityOutput
  macro_regime: MacroRegimeOutput
}

export interface MacroCycleOutput {
  cycle_phase: string
  cycle_score: number
  components: {
    risk: number
    opportunity: number
    trend: number
    volatility: number
    regime_score: number
    micro_final: number
  }
  reasoning: string
}

export function computeMacroCycle(inputs: MacroCycleInputs): MacroCycleOutput {
  const {
    micro,
    macro_risk,
    macro_opportunity,
    macro_trend,
    macro_volatility,
    macro_regime
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const risk = clamp(macro_risk.risk_score)
  const opp = clamp(macro_opportunity.opportunity_score)
  const trend = clamp(macro_trend.trend_score)
  const vol = clamp(macro_volatility.volatility_score)
  const regime_score = clamp(macro_regime.regime_score)
  const micro_final = clamp(micro.final_score)

  // Core macro cycle formula
  const cycle_score = clamp(
    0.25 * trend +
    0.20 * opp +
    0.15 * regime_score -
    0.20 * risk -
    0.10 * vol +
    0.10 * micro_final
  )

  let cycle_phase = "mid_cycle"

  if (cycle_score >= 0.80 && vol <= 0.40 && risk <= 0.40) {
    cycle_phase = "early_cycle"
  } else if (cycle_score >= 0.65) {
    cycle_phase = "mid_cycle"
  } else if (cycle_score >= 0.50) {
    cycle_phase = "late_cycle"
  } else if (cycle_score >= 0.40 && vol >= 0.60) {
    cycle_phase = "distribution"
  } else if (cycle_score >= 0.30 && risk >= 0.60) {
    cycle_phase = "contraction"
  } else if (cycle_score < 0.30 && vol >= 0.70) {
    cycle_phase = "capitulation"
  } else if (cycle_score < 0.40 && vol <= 0.40) {
    cycle_phase = "accumulation"
  }

  const components = {
    risk: Number(risk.toFixed(4)),
    opportunity: Number(opp.toFixed(4)),
    trend: Number(trend.toFixed(4)),
    volatility: Number(vol.toFixed(4)),
    regime_score: Number(regime_score.toFixed(4)),
    micro_final: Number(micro_final.toFixed(4))
  }

  const reasoning = `
Macro Cycle Evaluation

1. Macro Inputs
- Risk: ${risk}
- Opportunity: ${opp}
- Trend: ${trend}
- Volatility: ${vol}
- Regime score: ${regime_score}

2. Micro Influence
- Micro final score: ${micro_final}

3. Cycle Logic
- High trend + low risk + low volatility → early_cycle
- Strong trend + moderate risk → mid_cycle
- Weakening trend + rising risk → late_cycle
- High volatility + weakening trend → distribution
- High risk + low opportunity → contraction
- Extreme volatility + low cycle score → capitulation
- Low volatility + low cycle score → accumulation

Final:
- Cycle score: ${cycle_score.toFixed(4)}
- Cycle phase: ${cycle_phase}
`.trim()

  return {
    cycle_phase,
    cycle_score: Number(cycle_score.toFixed(4)),
    components,
    reasoning
  }
}
