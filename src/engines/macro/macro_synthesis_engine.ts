// src/engines/macro/macro_synthesis_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"
import { MacroRiskOutput } from "./macro_risk_engine"
import { MacroOpportunityOutput } from "./macro_opportunity_engine"
import { MacroTrendOutput } from "./macro_trend_engine"
import { MacroVolatilityOutput } from "./macro_volatility_engine"
import { MacroRegimeOutput } from "./macro_regime_engine"
import { MacroCycleOutput } from "./macro_cycle_engine"
import { MacroForecastOutput } from "./macro_forecast_engine"

export interface MacroSynthesisInputs {
  micro: MicroOutput
  macro_risk: MacroRiskOutput
  macro_opportunity: MacroOpportunityOutput
  macro_trend: MacroTrendOutput
  macro_volatility: MacroVolatilityOutput
  macro_regime: MacroRegimeOutput
  macro_cycle: MacroCycleOutput
  macro_forecast: MacroForecastOutput
}

export interface MacroSynthesisOutput {
  synthesis_score: number
  synthesis_label: string
  dominant_force: string
  vector: {
    risk: number
    opportunity: number
    trend: number
    volatility: number
    regime: number
    cycle: number
    forecast: number
    micro_final: number
  }
  reasoning: string
}

export function computeMacroSynthesis(inputs: MacroSynthesisInputs): MacroSynthesisOutput {
  const {
    micro,
    macro_risk,
    macro_opportunity,
    macro_trend,
    macro_volatility,
    macro_regime,
    macro_cycle,
    macro_forecast
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const risk = clamp(1 - macro_risk.risk_score) // inverted because lower risk = positive
  const opp = clamp(macro_opportunity.opportunity_score)
  const trend = clamp(macro_trend.trend_score)
  const vol = clamp(1 - macro_volatility.volatility_score) // inverted because lower vol = positive
  const regime = clamp(macro_regime.regime_score)
  const cycle = clamp(macro_cycle.cycle_score)
  const forecast = clamp(macro_forecast.forecast_score)
  const micro_final = clamp(micro.final_score)

  // Core synthesis formula
  const synthesis_score = clamp(
    0.20 * trend +
    0.20 * forecast +
    0.15 * opportunity +
    0.15 * regime +
    0.10 * cycle +
    0.10 * micro_final +
    0.05 * risk +
    0.05 * vol
  )

  const synthesis_label =
    synthesis_score >= 0.80 ? "very_bullish" :
    synthesis_score >= 0.65 ? "bullish" :
    synthesis_score >= 0.50 ? "neutral" :
    synthesis_score >= 0.35 ? "bearish" :
    "very_bearish"

  const vector = {
    risk: Number(risk.toFixed(4)),
    opportunity: Number(opp.toFixed(4)),
    trend: Number(trend.toFixed(4)),
    volatility: Number(vol.toFixed(4)),
    regime: Number(regime.toFixed(4)),
    cycle: Number(cycle.toFixed(4)),
    forecast: Number(forecast.toFixed(4)),
    micro_final: Number(micro_final.toFixed(4))
  }

  const dominant_force = Object.entries(vector)
    .sort((a, b) => b[1] - a[1])[0][0]

  const reasoning = `
Macro Synthesis Evaluation

Inputs:
- Risk (inverted): ${risk}
- Opportunity: ${opp}
- Trend: ${trend}
- Volatility (inverted): ${vol}
- Regime score: ${regime}
- Cycle score: ${cycle}
- Forecast score: ${forecast}
- Micro final score: ${micro_final}

Synthesis:
- Synthesis score: ${synthesis_score.toFixed(4)}
- Synthesis label: ${synthesis_label}
- Dominant macro force: ${dominant_force}
`.trim()

  return {
    synthesis_score: Number(synthesis_score.toFixed(4)),
    synthesis_label,
    dominant_force,
    vector,
    reasoning
  }
}
