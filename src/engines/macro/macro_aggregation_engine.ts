// src/engines/macro/macro_aggregation_engine.ts

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

export interface MacroAggregationInputs {
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

export interface MacroAggregationOutput {
  macro_intelligence: {
    risk: MacroRiskOutput
    opportunity: MacroOpportunityOutput
    trend: MacroTrendOutput
    volatility: MacroVolatilityOutput
    regime: MacroRegimeOutput
    cycle: MacroCycleOutput
    forecast: MacroForecastOutput
    synthesis: MacroSynthesisOutput
    confidence: MacroConfidenceOutput
    strategy: MacroStrategyOutput
    decision: MacroDecisionOutput
    routing: MacroRoutingOutput
    weighting: MacroWeightingOutput
    micro_final: number
  }
  final_macro_score: number
  final_macro_label: string
  reasoning: string
}

export function computeMacroAggregation(inputs: MacroAggregationInputs): MacroAggregationOutput {
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

  // Final macro score blends synthesis + confidence + strategy
  const final_macro_score = clamp(
    0.40 * macro_synthesis.synthesis_score +
    0.30 * macro_confidence.confidence_score +
    0.20 * macro_strategy.strategy_score +
    0.10 * micro.final_score
  )

  const final_macro_label =
    final_macro_score >= 0.80 ? "very_bullish" :
    final_macro_score >= 0.65 ? "bullish" :
    final_macro_score >= 0.50 ? "neutral" :
    final_macro_score >= 0.35 ? "bearish" :
    "very_bearish"

  const macro_intelligence = {
    risk: macro_risk,
    opportunity: macro_opportunity,
    trend: macro_trend,
    volatility: macro_volatility,
    regime: macro_regime,
    cycle: macro_cycle,
    forecast: macro_forecast,
    synthesis: macro_synthesis,
    confidence: macro_confidence,
    strategy: macro_strategy,
    decision: macro_decision,
    routing: macro_routing,
    weighting: macro_weighting,
    micro_final: micro.final_score
  }

  const reasoning = `
Macro Aggregation Summary

Final macro score is computed from:
- Synthesis score (40%): ${macro_synthesis.synthesis_score}
- Macro confidence (30%): ${macro_confidence.confidence_score}
- Macro strategy (20%): ${macro_strategy.strategy_score}
- Micro final score (10%): ${micro.final_score}

Final:
- Final macro score: ${final_macro_score.toFixed(4)}
- Final macro label: ${final_macro_label}
`.trim()

  return {
    macro_intelligence,
    final_macro_score: Number(final_macro_score.toFixed(4)),
    final_macro_label,
    reasoning
  }
}
