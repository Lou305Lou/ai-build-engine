// src/engines/macro/macro_output_engine.ts

import { MacroAggregationOutput } from "./macro_aggregation_engine"
import { MacroSummaryOutput } from "./macro_summary_engine"
import { MacroNarrativeOutput } from "./macro_narrative_engine"

export interface MacroOutputInputs {
  aggregation: MacroAggregationOutput
  summary: MacroSummaryOutput
  narrative: MacroNarrativeOutput
}

export interface MacroOutput {
  macro_intelligence: MacroAggregationOutput["macro_intelligence"]
  final_macro_score: number
  final_macro_label: string
  summary: MacroSummaryOutput["summary"]
  narrative: string
  key_points: string[]
  dominant_macro_theme: string
  reasoning: string
}

export function computeMacroOutput(inputs: MacroOutputInputs): MacroOutput {
  const { aggregation, summary, narrative } = inputs

  const macro_intelligence = aggregation.macro_intelligence
  const final_macro_score = aggregation.final_macro_score
  const final_macro_label = aggregation.final_macro_label

  const summary_block = summary.summary

  const narrative_text = narrative.narrative
  const key_points = narrative.key_points
  const dominant_macro_theme = narrative.dominant_macro_theme

  const reasoning = `
Macro Output Engine Summary

- Final macro score: ${final_macro_score}
- Final macro label: ${final_macro_label}
- Regime: ${summary_block.regime}
- Cycle: ${summary_block.cycle}
- Forecast: ${summary_block.forecast}
- Strategy: ${summary_block.strategy}
- Decision: ${summary_block.decision}
- Confidence: ${summary_block.confidence}

Narrative theme: ${dominant_macro_theme}
`.trim()

  return {
    macro_intelligence,
    final_macro_score,
    final_macro_label,
    summary: summary_block,
    narrative: narrative_text,
    key_points,
    dominant_macro_theme,
    reasoning
  }
}
