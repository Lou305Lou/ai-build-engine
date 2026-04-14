// src/engines/macro/macro_summary_engine.ts

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
import { MacroRoutingOutput } from "./macro_routing_engine"
import { MacroWeightingOutput } from "./macro_weighting_engine"

export interface MacroSummaryInputs {
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
  macro_routing: MacroRoutingOutput
  macro_weighting: MacroWeightingOutput
}

export interface MacroSummaryOutput {
  summary: {
    macro_label: string
    macro_score: number
    regime: string
    cycle: string
    forecast: string
    strategy: string
    decision: string
    confidence: string
  }
  reasoning: string
}

export function computeMacroSummary(inputs: MacroSummaryInputs): MacroSummaryOutput {
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
    macro_decision,
    macro_routing,
    macro_weighting
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Macro score = synthesis + confidence + strategy
  const macro_score = clamp(
    0.50 * macro_synthesis.synthesis_score +
    0.30 * macro_confidence.confidence_score +
    0.20 * macro_strategy.strategy_score
  )

  const macro_label =
    macro_score >= 0.80 ? "very_bullish" :
    macro_score >= 0.65 ? "bullish" :
    macro_score >= 0.50 ? "neutral" :
    macro_score >= 0.35 ? "bearish" :
    "very_bearish"

  const summary = {
    macro_label,
    macro_score: Number(macro_score.toFixed(4)),
    regime: macro_regime.regime,
    cycle: macro_cycle.cycle_phase,
    forecast: macro_forecast.forecast_label,
    strategy: macro_strategy.strategy_label,
    decision: macro_decision.dominant_decision,
    confidence: macro_confidence.confidence_label
  }

  const reasoning = `
Macro Summary Computation

- Macro score = 50% synthesis + 30% confidence + 20% strategy
- Macro label: ${macro_label}
- Regime: ${macro_regime.regime}
- Cycle: ${macro_cycle.cycle_phase}
- Forecast: ${macro_forecast.forecast_label}
- Strategy: ${macro_strategy.strategy_label}
- Decision: ${macro_decision.dominant_decision}
- Confidence: ${macro_confidence.confidence_label}
`.trim()

  return {
    summary,
    reasoning
  }
}
