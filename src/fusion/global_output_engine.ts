// src/fusion/global_output_engine.ts

import { GlobalIntelligence } from "./global_intelligence_engine"
import { GlobalNarrativeOutput } from "./global_narrative_engine"
import { GlobalConfidenceOutput } from "./global_confidence_engine"

export interface GlobalOutputInputs {
  global_intelligence: GlobalIntelligence
  global_narrative: GlobalNarrativeOutput
  global_confidence: GlobalConfidenceOutput
}

export interface GlobalOutput {
  global_score: number
  global_label: string
  global_theme: string
  confidence_score: number
  confidence_label: string
  micro: GlobalIntelligence["micro"]
  macro: GlobalIntelligence["macro"]
  fusion: GlobalIntelligence["fusion"]
  narrative: string
  key_points: string[]
  reasoning: string
}

export function computeGlobalOutput(inputs: GlobalOutputInputs): GlobalOutput {
  const { global_intelligence, global_narrative, global_confidence } = inputs

  const global_score = global_intelligence.global_score
  const global_label = global_intelligence.global_label
  const global_theme = global_narrative.global_theme

  const confidence_score = global_confidence.confidence_score
  const confidence_label = global_confidence.confidence_label

  const narrative = global_narrative.narrative
  const key_points = global_narrative.key_points

  const reasoning = `
Global Output Summary

Global Intelligence:
- Global score: ${global_score}
- Global label: ${global_label}
- Global theme: ${global_theme}

Confidence:
- Confidence score: ${confidence_score}
- Confidence label: ${confidence_label}

Fusion:
- Micro weight: ${global_intelligence.fusion.micro_weight}
- Macro weight: ${global_intelligence.fusion.macro_weight}
- Alignment: ${global_intelligence.fusion.alignment}
- Divergence: ${global_intelligence.fusion.divergence}

Narrative:
${narrative}
`.trim()

  return {
    global_score,
    global_label,
    global_theme,
    confidence_score,
    confidence_label,
    micro: global_intelligence.micro,
    macro: global_intelligence.macro,
    fusion: global_intelligence.fusion,
    narrative,
    key_points,
    reasoning
  }
}
