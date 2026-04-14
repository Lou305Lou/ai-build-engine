// src/fusion/global_intelligence_engine.ts

import { MicroOutput } from "../engines/micro/micro_output_engine"
import { MacroOutput } from "../engines/macro/macro_output_engine"

export interface GlobalIntelligenceInputs {
  micro_output: MicroOutput
  macro_output: MacroOutput
}

export interface GlobalIntelligence {
  global_score: number
  global_label: string
  micro: MicroOutput
  macro: MacroOutput
  fusion: {
    micro_weight: number
    macro_weight: number
    alignment: number
    divergence: number
  }
  reasoning: string
}

export function computeGlobalIntelligence(inputs: GlobalIntelligenceInputs): GlobalIntelligence {
  const { micro_output, macro_output } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const micro_score = clamp(micro_output.final_score)
  const macro_score = clamp(macro_output.final_macro_score)

  // Alignment = how close micro and macro are
  const alignment = clamp(1 - Math.abs(micro_score - macro_score))

  // Divergence = how far apart they are
  const divergence = clamp(Math.abs(micro_score - macro_score))

  // Fusion weights
  const micro_weight = clamp(0.50 + (alignment * 0.25))
  const macro_weight = clamp(0.50 - (alignment * 0.25))

  // Global score
  const global_score = clamp(
    micro_weight * micro_score +
    macro_weight * macro_score
  )

  const global_label =
    global_score >= 0.80 ? "very_bullish" :
    global_score >= 0.65 ? "bullish" :
    global_score >= 0.50 ? "neutral" :
    global_score >= 0.35 ? "bearish" :
    "very_bearish"

  const reasoning = `
Global Intelligence Fusion

Micro:
- Micro final score: ${micro_score}

Macro:
- Macro final score: ${macro_score}

Fusion:
- Alignment: ${alignment}
- Divergence: ${divergence}
- Micro weight: ${micro_weight}
- Macro weight: ${macro_weight}

Final:
- Global score: ${global_score.toFixed(4)}
- Global label: ${global_label}
`.trim()

  return {
    global_score: Number(global_score.toFixed(4)),
    global_label,
    micro: micro_output,
    macro: macro_output,
    fusion: {
      micro_weight: Number(micro_weight.toFixed(4)),
      macro_weight: Number(macro_weight.toFixed(4)),
      alignment: Number(alignment.toFixed(4)),
      divergence: Number(divergence.toFixed(4))
    },
    reasoning
  }
}
