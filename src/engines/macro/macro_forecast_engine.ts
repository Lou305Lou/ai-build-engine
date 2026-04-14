// src/engines/macro/macro_forecast_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"
import { MacroRiskOutput } from "./macro_risk_engine"
import { MacroOpportunityOutput } from "./macro_opportunity_engine"
import { MacroTrendOutput } from "./macro_trend_engine"
import { MacroVolatilityOutput } from "./macro_volatility_engine"
import { MacroRegimeOutput } from "./macro_regime_engine"
import { MacroCycleOutput } from "./macro_cycle_engine"

export interface MacroForecastInputs {
  micro: MicroOutput
  macro_risk: MacroRiskOutput
  macro_opportunity: MacroOpportunityOutput
  macro_trend: MacroTrendOutput
  macro_volatility: MacroVolatilityOutput
  macro_regime: MacroRegimeOutput
  macro_cycle: MacroCycleOutput
}

export interface MacroForecastOutput {
  forecast_score: number
  forecast_label: string
  directional_bias: string
  forward_risk_bias: string
  forward_volatility_bias: string
  forward_opportunity_bias: string
  horizon: {
    short_term: number
    medium_term: number
    long_term: number
  }
  reasoning: string
}

export function computeMacroForecast(inputs: MacroForecastInputs): MacroForecastOutput {
  const {
    micro,
    macro_risk,
    macro_opportunity,
    macro_trend,
    macro_volatility,
    macro_regime,
    macro_cycle
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const risk = clamp(macro_risk.risk_score)
  const opp = clamp(macro_opportunity.opportunity_score)
  const trend = clamp(macro_trend.trend_score)
  const vol = clamp(macro_volatility.volatility_score)
  const regime = clamp(macro_regime.regime_score)
  const cycle = clamp(macro_cycle.cycle_score)
  const micro_final = clamp(micro.final_score)

  // Core forecast formula
  const forecast_score = clamp(
    0.25 * trend +
    0.20 * opp +
    0.15 * regime +
    0.15 * cycle +
    0.10 * micro_final -
    0.10 * risk -
    0.05 * vol
  )

  const forecast_label =
    forecast_score >= 0.80 ? "very_bullish" :
    forecast_score >= 0.65 ? "bullish" :
    forecast_score >= 0.50 ? "neutral" :
    forecast_score >= 0.35 ? "bearish" :
    "very_bearish"

  const directional_bias =
    forecast_score >= 0.60 ? "upward" :
    forecast_score >= 0.45 ? "sideways" :
    "downward"

  const forward_risk_bias =
    risk >= 0.70 ? "rising_risk" :
    risk <= 0.30 ? "falling_risk" :
    "stable_risk"

  const forward_volatility_bias =
    vol >= 0.70 ? "volatility_expansion" :
    vol <= 0.30 ? "volatility_compression" :
    "volatility_neutral"

  const forward_opportunity_bias =
    opp >= 0.70 ? "high_opportunity" :
    opp <= 0.30 ? "low_opportunity" :
    "moderate_opportunity"

  const horizon = {
    short_term: Number((forecast_score * 0.9).toFixed(4)),
    medium_term: Number((forecast_score * 0.75).toFixed(4)),
    long_term: Number((forecast_score * 0.60).toFixed(4))
  }

  const reasoning = `
Macro Forecast Evaluation

Inputs:
- Risk: ${risk}
- Opportunity: ${opp}
- Trend: ${trend}
- Volatility: ${vol}
- Regime score: ${regime}
- Cycle score: ${cycle}
- Micro final score: ${micro_final}

Forecast:
- Forecast score: ${forecast_score.toFixed(4)}
- Forecast label: ${forecast_label}
- Directional bias: ${directional_bias}
- Forward risk bias: ${forward_risk_bias}
- Forward volatility bias: ${forward_volatility_bias}
- Forward opportunity bias: ${forward_opportunity_bias}

Horizon:
- Short-term: ${horizon.short_term}
- Medium-term: ${horizon.medium_term}
- Long-term: ${horizon.long_term}
`.trim()

  return {
    forecast_score: Number(forecast_score.toFixed(4)),
    forecast_label,
    directional_bias,
    forward_risk_bias,
    forward_volatility_bias,
    forward_opportunity_bias,
    horizon,
    reasoning
  }
}
