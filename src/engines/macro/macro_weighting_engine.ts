// src/engines/macro/macro_weighting_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"
import { MacroRiskOutput } from "./macro_risk_engine"
import { MacroOpportunityOutput } from "./macro_opportunity_engine"
import { MacroTrendOutput } from "./macro_trend_engine"
import { MacroVolatilityOutput } from "./macro_volatility_engine"
import { MacroRegimeOutput } from "./macro_regime_engine"
import { MacroCycleOutput } from "./macro_cycle_engine"
import { MacroForecastOutput } from "./macro_forecast_engine"
import { MacroSynthesisOutput } from "./macro_synthesis_engine"
import { MacroConfidenceOutput } from "./macro_confidence_engine"
import { MacroStrategyOutput } from "./macro_strategy_engine"
import { MacroDecisionOutput } from "./macro_decision_engine"

export interface MacroWeightingInputs {
  micro: MicroOutput
  macro_risk: MacroRiskOutput
  macro_opportunity: MacroOpportunityOutput
  macro_trend: MacroTrendOutput
  macro_volatility: MacroVolatilityOutput
  macro_regime: MacroRegimeOutput
  macro_cycle: MacroCycleOutput
  macro_forecast: MacroForecastOutput
  macro_synthesis: MacroSynthesisOutput
  macro_confidence: MacroConfidenceOutput
  macro_strategy: MacroStrategyOutput
  macro_decision: MacroDecisionOutput
}

export interface MacroWeightingOutput {
  weighting_score: number
  position_size: number
  max_exposure: number
  min_exposure: number
  hedge_ratio: number
  aggressiveness: string
  reasoning: string
}

export function computeMacroWeighting(inputs: MacroWeightingInputs): MacroWeightingOutput {
  const {
    micro,
    macro_risk,
    macro_opportunity,
    macro_trend,
    macro_volatility,
    macro_regime,
    macro_cycle,
    macro_forecast,
    macro_synthesis,
    macro_confidence,
    macro_strategy,
    macro_decision
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const opp = clamp(macro_opportunity.opportunity_score)
  const trend = clamp(macro_trend.trend_score)
  const forecast = clamp(macro_forecast.forecast_score)
  const synthesis = clamp(macro_synthesis.synthesis_score)
  const confidence = clamp(macro_confidence.confidence_score)
  const risk = clamp(macro_risk.risk_score)
  const vol = clamp(macro_volatility.volatility_score)
  const micro_final = clamp(micro.final_score)
  const strategy_score = clamp(macro_strategy.strategy_score)

  // Core weighting formula
  const weighting_score = clamp(
    0.25 * strategy_score +
    0.20 * confidence +
    0.20 * trend +
    0.15 * forecast +
    0.10 * synthesis +
    0.10 * micro_final -
    0.10 * risk -
    0.10 * vol
  )

  // Position sizing logic
  const position_size = Number(
    clamp(
      weighting_score * (1 - risk) * (1 - vol)
    ).toFixed(4)
  )

  const max_exposure = Number(
    clamp(
      position_size * (confidence + strategy_score)
    ).toFixed(4)
  )

  const min_exposure = Number(
    clamp(
      position_size * (1 - risk)
    ).toFixed(4)
  )

  const hedge_ratio = Number(
    clamp(
      risk * 0.6 + vol * 0.4
    ).toFixed(4)
  )

  const aggressiveness =
    weighting_score >= 0.80 ? "high" :
    weighting_score >= 0.60 ? "medium" :
    weighting_score >= 0.45 ? "low" :
    "minimal"

  const reasoning = `
Macro Weighting Evaluation

Inputs:
- Opportunity: ${opp}
- Trend: ${trend}
- Forecast: ${forecast}
- Synthesis: ${synthesis}
- Confidence: ${confidence}
- Micro final: ${micro_final}
- Risk: ${risk}
- Volatility: ${vol}
- Strategy score: ${strategy_score}

Outputs:
- Weighting score: ${weighting_score.toFixed(4)}
- Position size: ${position_size}
- Max exposure: ${max_exposure}
- Min exposure: ${min_exposure}
- Hedge ratio: ${hedge_ratio}
- Aggressiveness: ${aggressiveness}
`.trim()

  return {
    weighting_score: Number(weighting_score.toFixed(4)),
    position_size,
    max_exposure,
    min_exposure,
    hedge_ratio,
    aggressiveness,
    reasoning
  }
}
