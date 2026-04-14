// src/fusion/global_execution_engine.ts

import { GlobalIntelligence } from "./global_intelligence_engine"
import { GlobalRoutingOutput } from "./global_routing_engine"
import { GlobalWeightingOutput } from "./global_weighting_engine"
import { GlobalConfidenceOutput } from "./global_confidence_engine"
import { MicroOutput } from "../engines/micro/micro_output_engine"
import { MacroOutput } from "../engines/macro/macro_output_engine"

export interface GlobalExecutionInputs {
  micro_output: MicroOutput
  macro_output: MacroOutput
  global_intelligence: GlobalIntelligence
  global_routing: GlobalRoutingOutput
  global_weighting: GlobalWeightingOutput
  global_confidence: GlobalConfidenceOutput
}

export interface GlobalExecutionOutput {
  action: string
  action_vector: {
    buy: number
    sell: number
    hold: number
    scale_in: number
    scale_out: number
    hedge: number
    unhedge: number
  }
  execution_intensity: string
  reasoning: string
}

export function computeGlobalExecution(inputs: GlobalExecutionInputs): GlobalExecutionOutput {
  const { micro_output, macro_output, global_intelligence, global_routing, global_weighting, global_confidence } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Micro + Macro decision signals
  const micro_dec = micro_output.decision.dominant_decision
  const macro_dec = macro_output.macro_intelligence.decision.dominant_decision

  // Global signals
  const global_score = clamp(global_intelligence.global_score)
  const alignment = clamp(global_intelligence.fusion.alignment)
  const divergence = clamp(global_intelligence.fusion.divergence)
  const confidence = clamp(global_confidence.confidence_score)

  // Routing + Weighting signals
  const exposure = clamp(global_weighting.position_size)
  const hedge_ratio = clamp(global_weighting.hedge_ratio)

  // Decision vector components
  const buy = clamp(
    0.35 * (micro_dec === "buy" ? 1 : 0) +
    0.35 * (macro_dec === "buy" ? 1 : 0) +
    0.30 * global_score
  )

  const sell = clamp(
    0.35 * (micro_dec === "sell" ? 1 : 0) +
    0.35 * (macro_dec === "sell" ? 1 : 0) +
    0.30 * (1 - global_score)
  )

  const hold = clamp(
    0.50 * (1 - Math.abs(buy - sell)) +
    0.25 * alignment +
    0.25 * (1 - divergence)
  )

  const scale_in = clamp(
    buy * exposure * confidence
  )

  const scale_out = clamp(
    sell * (1 - confidence) * divergence
  )

  const hedge = clamp(
    hedge_ratio * (1 + divergence * 0.5)
  )

  const unhedge = clamp(
    (1 - hedge_ratio) * confidence
  )

  const action_vector = {
    buy: Number(buy.toFixed(4)),
    sell: Number(sell.toFixed(4)),
    hold: Number(hold.toFixed(4)),
    scale_in: Number(scale_in.toFixed(4)),
    scale_out: Number(scale_out.toFixed(4)),
    hedge: Number(hedge.toFixed(4)),
    unhedge: Number(unhedge.toFixed(4))
  }

  // Determine dominant action
  const action = Object.entries(action_vector).sort((a, b) => b[1] - a[1])[0][0]

  // Execution intensity
  const execution_intensity =
    confidence >= 0.80 ? "high" :
    confidence >= 0.60 ? "medium" :
    confidence >= 0.45 ? "low" :
    "minimal"

  const reasoning = `
Global Execution Evaluation

Micro decision: ${micro_dec}
Macro decision: ${macro_dec}

Fusion:
- Global score: ${global_score}
- Alignment: ${alignment}
- Divergence: ${divergence}
- Confidence: ${confidence}

Routing + Weighting:
- Exposure: ${exposure}
- Hedge ratio: ${hedge_ratio}

Action Vector:
${JSON.stringify(action_vector, null, 2)}

Final:
- Action: ${action}
- Execution intensity: ${execution_intensity}
`.trim()

  return {
    action,
    action_vector,
    execution_intensity,
    reasoning
  }
}

