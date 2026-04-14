// src/engines/macro/macro_trend_engine.ts

import { MicroOutput } from "../micro/micro_output_engine"
import { MacroRiskOutput } from "./macro_risk_engine"
import { MacroOpportunityOutput } from "./macro_opportunity_engine"

export interface MacroTrendInputs {
  micro: MicroOutput
  macro_risk: MacroRiskOutput
  macro_opportunity: MacroOpportunityOutput
  long_term_trend: number
  medium_term_momentum: number
  short_term_acceleration: number
  trend_persistence: number
  trend_reliability: number
}

export interface MacroTrendOutput {
  trend_score: number
  trend_label: string
  direction: string
  components: {
    long_term: number
    medium_term: number
    short_term: number
    persistence: number
    reliability: number
    opportunity_component: number
    risk_drag: number
  }
  reasoning: string
}

export function computeMacroTrend(inputs: MacroTrendInputs): MacroTrendOutput {
  const {
    micro,
    macro_risk,
    macro_opportunity,
    long_term_trend,
    medium_term_momentum,
    short_term_acceleration,
    trend_persistence,
    trend_reliability
  } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const lt = clamp(long_term_trend)
  const mt = clamp(medium_term_momentum)
  const st = clamp(short_term_acceleration)
  const pers = clamp(trend_persistence)
  const rel = clamp(trend_reliability)

  const opp = clamp(macro_opportunity.opportunity_score)
  const risk_drag = clamp(macro_risk.risk_score)

  // Core macro trend formula
  const trend_score = clamp(
    0.30 * lt +
    0.25 * mt +
    0.15 * st +
    0.15 * pers +
    0.10 * rel +
    0.10 * opp -
    0.15 * risk_drag
  )

  const trend_label =
    trend_score >= 0.85 ? "very_strong_uptrend" :
    trend_score >= 0.70 ? "strong_uptrend" :
    trend_score >= 0.55 ? "moderate_uptrend" :
    trend_score >= 0.45 ? "sideways" :
    trend_score >= 0.30 ? "moderate_downtrend" :
    "strong_downtrend"

  const direction =
    trend_score >= 0.55 ? "uptrend" :
    trend_score >= 0.45 ? "sideways" :
    "downtrend"

  const components = {
    long_term: Number(lt.toFixed(4)),
    medium_term: Number(mt.toFixed(4)),
    short_term: Number(st.toFixed(4)),
    persistence: Number(pers.toFixed(4)),
    reliability: Number(rel.toFixed(4)),
    opportunity_component: Number(opp.toFixed(4)),
    risk_drag: Number(risk_drag.toFixed(4))
  }

  const reasoning = `
Macro Trend Evaluation

1. Trend Structure
- Long-term trend: ${lt}
- Medium-term momentum: ${mt}
- Short-term acceleration: ${st}

2. Trend Quality
- Persistence: ${pers}
- Reliability: ${rel}

3. Macro Influence
- Opportunity boost: ${opp}
- Risk drag: ${risk_drag}

Final:
- Trend score: ${trend_score.toFixed(4)}
- Trend label: ${trend_label}
- Direction: ${direction}
`.trim()

  return {
    trend_score: Number(trend_score.toFixed(4)),
    trend_label,
    direction,
    components,
    reasoning
  }
}
