// src/engines/macro/macro_routing_engine.ts

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

export interface MacroRoutingInputs {
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

export interface MacroRoutingOutput {
  route_label: string
  timing: string
  aggressiveness: string
  exposure_modifier: number
  hedge_intensity: number
  reasoning: string
}

export function computeMacroRouting(inputs: MacroRoutingInputs): MacroRoutingOutput {
  const {
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

  const risk = clamp(macro_risk.risk_score)
  const opp = clamp(macro_opportunity.opportunity_score)
  const trend = clamp(macro_trend.trend_score)
  const vol = clamp(macro_volatility.volatility_score)
  const confidence = clamp(macro_confidence.confidence_score)
  const strategy_score = clamp(macro_strategy.strategy_score)

  const decision = macro_decision.dominant_decision

  // Timing logic
  const timing =
    decision === "buy" && trend >= 0.60 && vol <= 0.40 ? "immediate" :
    decision === "sell" && risk >= 0.60 ? "immediate" :
    confidence >= 0.70 ? "accelerated" :
    confidence >= 0.50 ? "normal" :
    "staggered"

  // Aggressiveness logic
  const aggressiveness =
    strategy_score >= 0.80 ? "high" :
    strategy_score >= 0.60 ? "medium" :
    strategy_score >= 0.45 ? "low" :
    "minimal"

  // Exposure modifier
  const exposure_modifier = Number(
    clamp(
      strategy_score * confidence * (1 - risk) * (1 - vol)
    ).toFixed(4)
  )

  // Hedge intensity
  const hedge_intensity = Number(
    clamp(
      risk * 0.6 + vol * 0.4
    ).toFixed(4)
  )

  const route_label =
    decision === "buy" ? "long_route" :
    decision === "sell" ? "short_route" :
    decision === "hedge" ? "hedged_route" :
    decision === "scale_in" ? "accumulation_route" :
    decision === "scale_out" ? "distribution_route" :
    "neutral_route"

  const reasoning = `
Macro Routing Evaluation

Inputs:
- Risk: ${risk}
- Opportunity: ${opp}
- Trend: ${trend}
- Volatility: ${vol}
- Confidence: ${confidence}
- Strategy score: ${strategy_score}
- Decision: ${decision}

Routing:
- Timing: ${timing}
- Aggressiveness: ${aggressiveness}
- Exposure modifier: ${exposure_modifier}
- Hedge intensity: ${hedge_intensity}
- Route label: ${route_label}
`.trim()

  return {
    route_label,
    timing,
    aggressiveness,
    exposure_modifier,
    hedge_intensity,
    reasoning
  }
}
