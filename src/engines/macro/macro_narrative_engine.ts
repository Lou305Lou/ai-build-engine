// src/engines/macro/macro_narrative_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"
import { MacroRiskOutput } from "./macro_risk_engine"
import { MacroOpportunityOutput } from "./macro_opportunity_engine"
import { MacroTrendOutput } from "./macro_trend_engine"
import { MacroVolatilityOutput } from "./macro_volatility_engine"
import { MacroRegimeOutput } from "./macro_regime_engine"
import { MacroCycleOutput } from "./macro_cycle_engine"
import { MacroForecastOutput } from "./macro_forecast_engine"
import { MacroSynthesisOutput } from "./macro_synthesis_engine"

export interface MacroNarrativeInputs {
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

export interface MacroNarrativeOutput {
  narrative: string
  key_points: string[]
  dominant_macro_theme: string
  reasoning: string
}

export function computeMacroNarrative(inputs: MacroNarrativeInputs): MacroNarrativeOutput {
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

  const narrative = `
Macro Narrative Summary

The market environment is currently classified as "${macro_regime.regime}", driven by a balance of
risk (${macro_risk.risk_label}), opportunity (${macro_opportunity.opportunity_label}), and trend
conditions (${macro_trend.trend_label}). Volatility is assessed as "${macro_volatility.volatility_label}",
indicating a ${macro_volatility.regime} volatility regime.

Cycle analysis places the market in the "${macro_cycle.cycle_phase}" phase, suggesting that broader
macro forces are ${macro_forecast.directional_bias} with a forward outlook labeled as
"${macro_forecast.forecast_label}". The synthesis engine identifies "${macro_synthesis.dominant_force}"
as the dominant macro force shaping current conditions.

Overall, the macro environment reflects a forward bias of "${macro_forecast.directional_bias}" with
a synthesis score of ${macro_synthesis.synthesis_score}, indicating a "${macro_synthesis.synthesis_label}"
macro backdrop. Micro-level intelligence contributes a final score of ${micro.final_score}, reinforcing
the broader macro narrative.
`.trim()

  const key_points = [
    `Regime: ${macro_regime.regime}`,
    `Risk: ${macro_risk.risk_label}`,
    `Opportunity: ${macro_opportunity.opportunity_label}`,
    `Trend: ${macro_trend.trend_label}`,
    `Volatility: ${macro_volatility.volatility_label}`,
    `Cycle Phase: ${macro_cycle.cycle_phase}`,
    `Forecast: ${macro_forecast.forecast_label}`,
    `Dominant Macro Force: ${macro_synthesis.dominant_force}`
  ]

  const dominant_macro_theme = macro_synthesis.synthesis_label

  const reasoning = `
Narrative derived from:
- Macro regime: ${macro_regime.regime}
- Macro risk: ${macro_risk.risk_label}
- Macro opportunity: ${macro_opportunity.opportunity_label}
- Macro trend: ${macro_trend.trend_label}
- Macro volatility: ${macro_volatility.volatility_label}
- Macro cycle: ${macro_cycle.cycle_phase}
- Macro forecast: ${macro_forecast.forecast_label}
- Macro synthesis: ${macro_synthesis.synthesis_label}
- Micro final score: ${micro.final_score}
`.trim()

  return {
    narrative,
    key_points,
    dominant_macro_theme,
    reasoning
  }
}
