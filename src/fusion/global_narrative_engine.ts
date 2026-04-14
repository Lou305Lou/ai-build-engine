// src/fusion/global_narrative_engine.ts

import { MicroOutput } from "../engines/micro/micro_output_engine"
import { MacroOutput } from "../engines/macro/macro_output_engine"
import { GlobalIntelligence } from "./global_intelligence_engine"

export interface GlobalNarrativeInputs {
  micro_output: MicroOutput
  macro_output: MacroOutput
  global_intelligence: GlobalIntelligence
}

export interface GlobalNarrativeOutput {
  narrative: string
  key_points: string[]
  global_theme: string
  reasoning: string
}

export function computeGlobalNarrative(inputs: GlobalNarrativeInputs): GlobalNarrativeOutput {
  const { micro_output, macro_output, global_intelligence } = inputs

  const micro_narrative = micro_output.narrative
  const macro_narrative = macro_output.narrative

  const global_score = global_intelligence.global_score
  const global_label = global_intelligence.global_label
  const alignment = global_intelligence.fusion.alignment
  const divergence = global_intelligence.fusion.divergence

  const narrative = `
Global Market Narrative

The global intelligence system currently evaluates market conditions as "${global_label}", with a 
global score of ${global_score}. Micro-level signals indicate: 

${micro_narrative}

At the same time, macro-level forces present the following environment:

${macro_narrative}

Fusion analysis shows a micro–macro alignment of ${alignment}, indicating that the two layers are 
${alignment >= 0.65 ? "reinforcing each other" : alignment >= 0.40 ? "partially aligned" : "divergent"}.

Overall, the combined global environment reflects a "${global_label}" posture, shaped by both 
micro-level dynamics and macro-level structural forces.
`.trim()

  const key_points = [
    `Global label: ${global_label}`,
    `Global score: ${global_score}`,
    `Micro final score: ${micro_output.final_score}`,
    `Macro final score: ${macro_output.final_macro_score}`,
    `Micro–macro alignment: ${alignment}`,
    `Micro–macro divergence: ${divergence}`,
    `Dominant macro theme: ${macro_output.dominant_macro_theme}`,
    `Dominant micro theme: ${micro_output.dominant_micro_theme}`
  ]

  const global_theme = global_label

  const reasoning = `
Global Narrative Computation

- Micro narrative and macro narrative merged into unified global story.
- Global score: ${global_score}
- Global label: ${global_label}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Dominant macro theme: ${macro_output.dominant_macro_theme}
- Dominant micro theme: ${micro_output.dominant_micro_theme}
`.trim()

  return {
    narrative,
    key_points,
    global_theme,
    reasoning
  }
}
