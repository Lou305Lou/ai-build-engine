// src/fusion/global_confidence_engine.ts

import { MicroOutput } from "../engines/micro/micro_output_engine"
import { MacroOutput } from "../engines/macro/macro_output_engine"
import { GlobalIntelligence } from "./global_intelligence_engine"

export interface GlobalConfidenceInputs {
  micro_output: MicroOutput
  macro_output: MacroOutput
  global_intelligence: GlobalIntelligence
}

export interface GlobalConfidenceOutput {
  confidence_score: number
  confidence_label: string
  components: {
    micro_confidence: number
    macro_confidence: number
    alignment: number
    divergence_penalty: number
    volatility_penalty: number
  }
  reasoning: string
}

export function computeGlobalConfidence(inputs: GlobalConfidenceInputs): GlobalConfidenceOutput {
  const { micro_output, macro_output, global_intelligence } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const micro_conf = clamp(micro_output.confidence_score)
  const macro_conf = clamp(macro_output.macro_intelligence.confidence.confidence_score)

  const alignment = clamp(global_intelligence.fusion.alignment)
  const divergence = clamp(global_intelligence.fusion.divergence)

  const volatility_penalty = clamp(
    macro_output.macro_intelligence.volatility.volatility_score
  )

  const divergence_penalty = clamp(divergence)

  // Global confidence formula
  const confidence_score = clamp(
    0.35 * micro_conf +
    0.35 * macro_conf +
    0.20 * alignment -
    0.05 * divergence_penalty -
    0.05 * volatility_penalty
  )

  const confidence_label =
    confidence_score >= 0.85 ? "very_high" :
    confidence_score >= 0.70 ? "high" :
    confidence_score >= 0.55 ? "moderate" :
    confidence_score >= 0.40 ? "low" :
    "very_low"

  const components = {
    micro_confidence: Number(micro_conf.toFixed(4)),
    macro_confidence: Number(macro_conf.toFixed(4)),
    alignment: Number(alignment.toFixed(4)),
    divergence_penalty: Number(divergence_penalty.toFixed(4)),
    volatility_penalty: Number(volatility_penalty.toFixed(4))
  }

  const reasoning = `
Global Confidence Evaluation

1. Micro Confidence
- Micro confidence score: ${components.micro_confidence}

2. Macro Confidence
- Macro confidence score: ${components.macro_confidence}

3. Alignment
- Micro–macro alignment: ${components.alignment}

4. Penalties
- Divergence penalty: ${components.divergence_penalty}
- Volatility penalty: ${components.volatility_penalty}

Final:
- Global confidence score: ${confidence_score.toFixed(4)}
- Global confidence label: ${confidence_label}
`.trim()

  return {
    confidence_score: Number(confidence_score.toFixed(4)),
    confidence_label,
    components,
    reasoning
  }
}
