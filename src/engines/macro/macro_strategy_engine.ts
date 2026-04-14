// src/engines/macro/macro_strategy_engine.ts

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

export interface MacroStrategyInputs {
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
}

export interface MacroStrategyOutput {
  strategy_label: string
  strategy_score: number
  posture: string
  conviction: string
  components: {
    opportunity: number
    trend: number
    forecast: number
    synthesis: number
    confidence: number
    risk_penalty: number
    volatility_penalty: number
  }
  reasoning: string
}

export function computeMacroStrategy(inputs: MacroStrategyInputs): MacroStrategyOutput {
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
    macro_confidence
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const opp = clamp(macro_opportunity.opportunity_score)
  const trend = clamp(macro_trend.trend_score)
  const forecast = clamp(macro_forecast.forecast_score)
  const synthesis = clamp(macro_synthesis.synthesis_score)
  const confidence = clamp(macro_confidence.confidence_score)
  const risk_penalty = clamp(macro_risk.risk_score)
  const vol_penalty = clamp(macro_volatility.volatility_score)

  // Core macro strategy formula
  const strategy_score = clamp(
    0.25 * opp +
    0.20 * trend +
    0.20 * forecast +
    0.15 * synthesis +
    0.10 * confidence -
    0.05 * risk_penalty -
    0.05 * vol_penalty
  )

  const strategy_label =
    strategy_score >= 0.80 ? "offensive" :
    strategy_score >= 0.65 ? "opportunistic" :
    strategy_score >= 0.50 ? "neutral" :
    strategy_score >= 0.35 ? "defensive" :
    "hedged"

  const posture =
    strategy_label === "offensive" ? "risk_on" :
    strategy_label === "opportunistic" ? "selective_risk_on" :
    strategy_label === "neutral" ? "balanced" :
    strategy_label === "defensive" ? "risk_off" :
    "capital_preservation"

  const conviction =
    confidence >= 0.75 ? "high" :
    confidence >= 0.55 ? "medium" :
    "low"

  const components = {
    opportunity: Number(opp.toFixed(4)),
    trend: Number(trend.toFixed(4)),
    forecast: Number(forecast.toFixed(4)),
    synthesis: Number(synthesis.toFixed(4)),
    confidence: Number(confidence.toFixed(4)),
    risk_penalty: Number(risk_penalty.toFixed(4)),
    volatility_penalty: Number(vol_penalty.toFixed(4))
  }

  const reasoning = `
Macro Strategy Evaluation

Positive Drivers:
- Opportunity: ${opp}
- Trend strength: ${trend}
- Forecast: ${forecast}
- Synthesis: ${synthesis}
- Macro confidence: ${confidence}

Negative Drivers:
- Risk penalty: ${risk_penalty}
- Volatility penalty: ${vol_penalty}

Final:
- Strategy score: ${strategy_score.toFixed(4)}
- Strategy label: ${strategy_label}
- Posture: ${posture}
- Conviction: ${conviction}
`.trim()

  return {
    strategy_label,
    strategy_score: Number(strategy_score.toFixed(4)),
    posture,
    conviction,
    components,
    reasoning
  }
}
