// src/fusion/global_routing_engine.ts

import { GlobalIntelligence } from "./global_intelligence_engine"
import { GlobalConfidenceOutput } from "./global_confidence_engine"
import { MicroOutput } from "../engines/micro/micro_output_engine"
import { MacroOutput } from "../engines/macro/macro_output_engine"

export interface GlobalRoutingInputs {
  micro_output: MicroOutput
  macro_output: MacroOutput
  global_intelligence: GlobalIntelligence
  global_confidence: GlobalConfidenceOutput
}

export interface GlobalRoutingOutput {
  route_label: string
  timing: string
  aggressiveness: string
  exposure_modifier: number
  hedge_intensity: number
  reasoning: string
}

export function computeGlobalRouting(inputs: GlobalRoutingInputs): GlobalRoutingOutput {
  const { micro_output, macro_output, global_intelligence, global_confidence } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Micro routing signals
  const micro_route = micro_output.routing.route_label
  const micro_exposure = clamp(micro_output.routing.exposure_modifier)
  const micro_hedge = clamp(micro_output.routing.hedge_intensity)

  // Macro routing signals
  const macro_route = macro_output.macro_intelligence.routing.route_label
  const macro_exposure = clamp(macro_output.macro_intelligence.routing.exposure_modifier)
  const macro_hedge = clamp(macro_output.macro_intelligence.routing.hedge_intensity)

  // Global intelligence signals
  const global_score = clamp(global_intelligence.global_score)
  const alignment = clamp(global_intelligence.fusion.alignment)
  const divergence = clamp(global_intelligence.fusion.divergence)

  // Global confidence signals
  const confidence = clamp(global_confidence.confidence_score)

  // Exposure modifier blends micro + macro + global
  const exposure_modifier = Number(
    clamp(
      0.40 * micro_exposure +
      0.40 * macro_exposure +
      0.20 * global_score
    ).toFixed(4)
  )

  // Hedge intensity blends micro + macro + global penalties
  const hedge_intensity = Number(
    clamp(
      0.35 * micro_hedge +
      0.35 * macro_hedge +
      0.30 * divergence
    ).toFixed(4)
  )

  // Timing logic
  const timing =
    confidence >= 0.80 && alignment >= 0.70 ? "immediate" :
    confidence >= 0.60 ? "accelerated" :
    confidence >= 0.45 ? "normal" :
    "staggered"

  // Aggressiveness logic
  const aggressiveness =
    global_score >= 0.80 ? "high" :
    global_score >= 0.60 ? "medium" :
    global_score >= 0.45 ? "low" :
    "minimal"

  // Route label blending micro + macro
  const route_label =
    alignment >= 0.65 ? macro_route :
    alignment >= 0.40 ? "blended_route" :
    micro_route

  const reasoning = `
Global Routing Evaluation

Micro:
- Micro route: ${micro_route}
- Micro exposure: ${micro_exposure}
- Micro hedge: ${micro_hedge}

Macro:
- Macro route: ${macro_route}
- Macro exposure: ${macro_exposure}
- Macro hedge: ${macro_hedge}

Fusion:
- Global score: ${global_score}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Confidence: ${confidence}

Outputs:
- Route label: ${route_label}
- Timing: ${timing}
- Aggressiveness: ${aggressiveness}
- Exposure modifier: ${exposure_modifier}
- Hedge intensity: ${hedge_intensity}
`.trim()

  return {
    route_label,
    timing,
    aggressiveness,
    exposure_modifier,
    hedge_intensity,
    reasoning
  }
}
