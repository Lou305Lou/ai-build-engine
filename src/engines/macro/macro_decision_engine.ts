// src/engines/macro/macro_decision_engine.ts

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

export interface MacroDecisionInputs {
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
}

export interface MacroDecisionOutput {
  decision_label: string
  decision_vector: {
    buy: number
    sell: number
    hold: number
    hedge: number
    scale_in: number
    scale_out: number
  }
  dominant_decision: string
  reasoning: string
}

export function computeMacroDecision(inputs: MacroDecisionInputs): MacroDecisionOutput {
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
    macro_strategy
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const opp = clamp(macro_opportunity.opportunity_score)
  const trend = clamp(macro_trend.trend_score)
  const forecast = clamp(macro_forecast.forecast_score)
  const synthesis = clamp(macro_synthesis.synthesis_score)
  const confidence = clamp(macro_confidence.confidence_score)
  const risk = clamp(macro_risk.risk_score)
  const vol = clamp(macro_volatility.volatility_score)

  const strategy_score = clamp(macro_strategy.strategy_score)

  // Decision vector components
  const buy = clamp(
    0.30 * opp +
    0.25 * trend +
    0.20 * forecast +
    0.15 * synthesis +
    0.10 * confidence -
    0.10 * risk -
    0.10 * vol
  )

  const sell = clamp(
    0.30 * risk +
    0.25 * vol -
    0.20 * opp -
    0.15 * trend -
    0.10 * forecast +
    0.10 * (1 - confidence)
  )

  const hold = clamp(
    0.40 * (1 - Math.abs(buy - sell)) +
    0.30 * (1 - vol) +
    0.30 * (1 - risk)
  )

  const hedge = clamp(
    0.40 * risk +
    0.40 * vol +
    0.20 * (1 - confidence)
  )

  const scale_in = clamp(
    buy * strategy_score * confidence
  )

  const scale_out = clamp(
    sell * (risk + vol) * (1 - confidence)
  )

  const decision_vector = {
    buy: Number(buy.toFixed(4)),
    sell: Number(sell.toFixed(4)),
    hold: Number(hold.toFixed(4)),
    hedge: Number(hedge.toFixed(4)),
    scale_in: Number(scale_in.toFixed(4)),
    scale_out: Number(scale_out.toFixed(4))
  }

  const dominant_decision = Object.entries(decision_vector)
    .sort((a, b) => b[1] - a[1])[0][0]

  const decision_label = dominant_decision

  const reasoning = `
Macro Decision Evaluation

Inputs:
- Opportunity: ${opp}
- Trend: ${trend}
- Forecast: ${forecast}
- Synthesis: ${synthesis}
- Confidence: ${confidence}
- Risk: ${risk}
- Volatility: ${vol}
- Strategy score: ${strategy_score}

Decision Vector:
- Buy: ${decision_vector.buy}
- Sell: ${decision_vector.sell}
- Hold: ${decision_vector.hold}
- Hedge: ${decision_vector.hedge}
- Scale-in: ${decision_vector.scale_in}
- Scale-out: ${decision_vector.scale_out}

Final:
- Dominant decision: ${dominant_decision}
`.trim()

  return {
    decision_label,
    decision_vector,
    dominant_decision,
    reasoning
  }
}
