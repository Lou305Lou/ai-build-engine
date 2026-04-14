// src/fusion/global_weighting_engine.ts

import { GlobalIntelligence } from "./global_intelligence_engine"
import { GlobalConfidenceOutput } from "./global_confidence_engine"
import { GlobalRoutingOutput } from "./global_routing_engine"
import { MicroOutput } from "../engines/micro/micro_output_engine"
import { MacroOutput } from "../engines/macro/macro_output_engine"

export interface GlobalWeightingInputs {
  micro_output: MicroOutput
  macro_output: MacroOutput
  global_intelligence: GlobalIntelligence
  global_confidence: GlobalConfidenceOutput
  global_routing: GlobalRoutingOutput
}

export interface GlobalWeightingOutput {
  weighting_score: number
  position_size: number
  max_exposure: number
  min_exposure: number
  hedge_ratio: number
  aggressiveness: string
  reasoning: string
}

export function computeGlobalWeighting(inputs: GlobalWeightingInputs): GlobalWeightingOutput {
  const { micro_output, macro_output, global_intelligence, global_confidence, global_routing } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Micro signals
  const micro_weight = clamp(micro_output.weighting.position_size)
  const micro_conf = clamp(micro_output.confidence_score)

  // Macro signals
  const macro_weight = clamp(macro_output.macro_intelligence.weighting.position_size)
  const macro_conf = clamp(macro_output.macro_intelligence.confidence.confidence_score)

  // Global signals
  const global_score = clamp(global_intelligence.global_score)
  const alignment = clamp(global_intelligence.fusion.alignment)
  const divergence = clamp(global_intelligence.fusion.divergence)
  const confidence = clamp(global_confidence.confidence_score)

  // Routing signals
  const exposure_modifier = clamp(global_routing.exposure_modifier)
  const hedge_intensity = clamp(global_routing.hedge_intensity)

  // Core weighting formula
  const weighting_score = clamp(
    0.30 * micro_weight +
    0.30 * macro_weight +
    0.20 * global_score +
    0.10 * alignment +
    0.10 * confidence -
    0.10 * divergence
  )

  // Position size
  const position_size = Number(
    clamp(
      weighting_score * exposure_modifier * confidence
    ).toFixed(4)
  )

  // Max exposure
  const max_exposure = Number(
    clamp(
      position_size * (0.5 + confidence * 0.5)
    ).toFixed(4)
  )

  // Min exposure
  const min_exposure = Number(
    clamp(
      position_size * (1 - hedge_intensity)
    ).toFixed(4)
  )

  // Hedge ratio
  const hedge_ratio = Number(
    clamp(
      hedge_intensity * (1 + divergence * 0.5)
    ).toFixed(4)
  )

  const aggressiveness =
    weighting_score >= 0.80 ? "high" :
    weighting_score >= 0.60 ? "medium" :
    weighting_score >= 0.45 ? "low" :
    "minimal"

  const reasoning = `
Global Weighting Evaluation

Micro:
- Micro position size: ${micro_weight}
- Micro confidence: ${micro_conf}

Macro:
- Macro position size: ${macro_weight}
- Macro confidence: ${macro_conf}

Fusion:
- Global score: ${global_score}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Global confidence: ${confidence}

Routing:
- Exposure modifier: ${exposure_modifier}
- Hedge intensity: ${hedge_intensity}

Outputs:
- Weighting score: ${weighting_score.toFixed(4)}
- Position size: ${position_size}
- Max exposure: ${max_exposure}
- Min exposure: ${min_exposure}
- Hedge ratio: ${hedge_ratio}
- Aggressiveness: ${aggressiveness}
`.trim()

  return {
    weighting_score: Number(weighting_score.toFixed(4)),
    position_size,
    max_exposure,
    min_exposure,
    hedge_ratio,
    aggressiveness,
    reasoning
  }
}
