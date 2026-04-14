// src/fusion/global_telemetry_engine.ts

import { GlobalIntelligence } from "./global_intelligence_engine"
import { GlobalConfidenceOutput } from "./global_confidence_engine"
import { GlobalRoutingOutput } from "./global_routing_engine"
import { GlobalWeightingOutput } from "./global_weighting_engine"
import { GlobalExecutionOutput } from "./global_execution_engine"
import { MicroOutput } from "../engines/micro/micro_output_engine"
import { MacroOutput } from "../engines/macro/macro_output_engine"

export interface GlobalTelemetryInputs {
  micro_output: MicroOutput
  macro_output: MacroOutput
  global_intelligence: GlobalIntelligence
  global_confidence: GlobalConfidenceOutput
  global_routing: GlobalRoutingOutput
  global_weighting: GlobalWeightingOutput
  global_execution: GlobalExecutionOutput
}

export interface GlobalTelemetryOutput {
  system_health: string
  signal_quality: string
  volatility_stress: number
  alignment_stability: number
  confidence_stability: number
  execution_readiness: string
  metrics: {
    micro_confidence: number
    macro_confidence: number
    global_confidence: number
    alignment: number
    divergence: number
    volatility: number
  }
  reasoning: string
}

export function computeGlobalTelemetry(inputs: GlobalTelemetryInputs): GlobalTelemetryOutput {
  const { micro_output, macro_output, global_intelligence, global_confidence } = inputs

  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Core metrics
  const micro_conf = clamp(micro_output.confidence_score)
  const macro_conf = clamp(macro_output.macro_intelligence.confidence.confidence_score)
  const global_conf = clamp(global_confidence.confidence_score)

  const alignment = clamp(global_intelligence.fusion.alignment)
  const divergence = clamp(global_intelligence.fusion.divergence)

  const volatility = clamp(macro_output.macro_intelligence.volatility.volatility_score)

  // Telemetry calculations
  const volatility_stress = Number((volatility * (1 + divergence * 0.5)).toFixed(4))
  const alignment_stability = Number((alignment * (1 - divergence)).toFixed(4))
  const confidence_stability = Number(((micro_conf + macro_conf + global_conf) / 3).toFixed(4))

  // System health
  const system_health =
    confidence_stability >= 0.75 && volatility_stress <= 0.35 ? "excellent" :
    confidence_stability >= 0.60 && volatility_stress <= 0.50 ? "good" :
    confidence_stability >= 0.45 && volatility_stress <= 0.65 ? "fair" :
    "degraded"

  // Signal quality
  const signal_quality =
    alignment >= 0.70 && divergence <= 0.30 ? "high" :
    alignment >= 0.50 ? "medium" :
    alignment >= 0.35 ? "low" :
    "very_low"

  // Execution readiness
  const execution_readiness =
    system_health === "excellent" && signal_quality === "high" ? "ready" :
    system_health === "good" ? "caution" :
    "not_ready"

  const metrics = {
    micro_confidence: Number(micro_conf.toFixed(4)),
    macro_confidence: Number(macro_conf.toFixed(4)),
    global_confidence: Number(global_conf.toFixed(4)),
    alignment: Number(alignment.toFixed(4)),
    divergence: Number(divergence.toFixed(4)),
    volatility: Number(volatility.toFixed(4))
  }

  const reasoning = `
Global Telemetry Evaluation

Confidence:
- Micro: ${metrics.micro_confidence}
- Macro: ${metrics.macro_confidence}
- Global: ${metrics.global_confidence}

Fusion:
- Alignment: ${metrics.alignment}
- Divergence: ${metrics.divergence}

Volatility:
- Volatility score: ${metrics.volatility}
- Volatility stress: ${volatility_stress}

Stability:
- Alignment stability: ${alignment_stability}
- Confidence stability: ${confidence_stability}

Outputs:
- System health: ${system_health}
- Signal quality: ${signal_quality}
- Execution readiness: ${execution_readiness}
`.trim()

  return {
    system_health,
    signal_quality,
    volatility_stress,
    alignment_stability,
    confidence_stability,
    execution_readiness,
    metrics,
    reasoning
  }
}
