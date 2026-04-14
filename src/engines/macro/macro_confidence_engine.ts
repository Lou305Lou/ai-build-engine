// src/engines/macro/macro_confidence_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"
import { MacroRiskOutput } from "./macro_risk_engine"
import { MacroOpportunityOutput } from "./macro_opportunity_engine"
import { MacroTrendOutput } from "./macro_trend_engine"
import { MacroVolatilityOutput } from "./macro_volatility_engine"
import { MacroRegimeOutput } from "./macro_regime_engine"
import { MacroCycleOutput } from "./macro_cycle_engine"
import { MacroForecastOutput } from "./macro_forecast_engine"
import { MacroSynthesisOutput } from "./macro_synthesis_engine"

export interface MacroConfidenceInputs {
  micro: MicroOutput
  macro_risk: MacroRiskOutput
  macro_opportunity: MacroOpportunityOutput
  macro_trend: MacroTrendOutput
  macro_volatility: MacroVolatilityOutput
  macro_regime: MacroRegimeOutput
  macro_cycle: MacroCycleOutput
  macro_forecast: MacroForecastOutput
  macro_synthesis: MacroSynthesisOutput
}

export interface MacroConfidenceOutput {
  confidence_score: number
  confidence_label: string
  components: {
    consistency: number
    stability: number
    alignment: number
    micro_macro_convergence: number
    volatility_penalty: number
  }
  reasoning: string
}

export function computeMacroConfidence(inputs: MacroConfidenceInputs): MacroConfidenceOutput {
  const {
    micro,
    macro_risk,
    macro_opportunity,
    macro_trend,
    macro_volatility,
    macro_regime,
    macro_cycle,
    macro_forecast,
    macro_synthesis
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Consistency: do macro engines agree directionally?
  const consistency = clamp(
    (macro_opportunity.opportunity_score +
     macro_trend.trend_score +
     macro_forecast.forecast_score +
     macro_synthesis.synthesis_score) / 4
  )

  // Stability: low volatility + stable regime + stable cycle
  const stability = clamp(
    0.40 * (1 - macro_volatility.volatility_score) +
    0.35 * macro_regime.regime_score +
    0.25 * macro_cycle.cycle_score
  )

  // Alignment: do risk, opportunity, and trend logically align?
  const alignment = clamp(
    0.40 * macro_opportunity.opportunity_score +
    0.35 * macro_trend.trend_score -
    0.25 * macro_risk.risk_score
  )

  // Micro–macro convergence: do micro and macro agree?
  const micro_macro_convergence = clamp(
    1 - Math.abs(micro.final_score - macro_synthesis.synthesis_score)
  )

  // Volatility penalty: high volatility reduces confidence
  const volatility_penalty = clamp(macro_volatility.volatility_score)

  // Final macro confidence score
  const confidence_score = clamp(
    0.30 * consistency +
    0.25 * stability +
    0.20 * alignment +
    0.15 * micro_macro_convergence -
    0.10 * volatility_penalty
  )

  const confidence_label =
    confidence_score >= 0.85 ? "very_high" :
    confidence_score >= 0.70 ? "high" :
    confidence_score >= 0.55 ? "moderate" :
    confidence_score >= 0.40 ? "low" :
    "very_low"

  const components = {
    consistency: Number(consistency.toFixed(4)),
    stability: Number(stability.toFixed(4)),
    alignment: Number(alignment.toFixed(4)),
    micro_macro_convergence: Number(micro_macro_convergence.toFixed(4)),
    volatility_penalty: Number(volatility_penalty.toFixed(4))
  }

  const reasoning = `
Macro Confidence Evaluation

1. Consistency
- Macro engines directional agreement: ${components.consistency}

2. Stability
- Regime stability + cycle stability + low volatility: ${components.stability}

3. Alignment
- Risk vs opportunity vs trend coherence: ${components.alignment}

4. Micro–Macro Convergence
- Agreement between micro final score and macro synthesis: ${components.micro_macro_convergence}

5. Volatility Penalty
- High volatility reduces confidence: ${components.volatility_penalty}

Final:
- Macro confidence score: ${confidence_score.toFixed(4)}
- Macro confidence label: ${confidence_label}
`.trim()

  return {
    confidence_score: Number(confidence_score.toFixed(4)),
    confidence_label,
    components,
    reasoning
  }
}
