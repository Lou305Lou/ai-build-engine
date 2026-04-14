// src/fusion/global_output_aggregation_engine.ts

import { GlobalIntelligence } from "./global_intelligence_engine"
import { GlobalRoutingOutput } from "./global_routing_engine"
import { GlobalWeightingOutput } from "./global_weighting_engine"
import { GlobalExecutionOutput } from "./global_execution_engine"
import { GlobalConfidenceOutput } from "./global_confidence_engine"
import { GlobalNarrativeOutput } from "./global_narrative_engine"

export interface GlobalOutputAggregationInputs {
  global_intelligence: GlobalIntelligence
  global_routing: GlobalRoutingOutput
  global_weighting: GlobalWeightingOutput
  global_execution: GlobalExecutionOutput
  global_confidence: GlobalConfidenceOutput
  global_narrative: GlobalNarrativeOutput
}

export interface GlobalOutputAggregation {
  packet: {
    global_score: number
    global_label: string
    global_theme: string
    confidence_score: number
    confidence_label: string
    routing: GlobalRoutingOutput
    weighting: GlobalWeightingOutput
    execution: GlobalExecutionOutput
    micro: GlobalIntelligence["micro"]
    macro: GlobalIntelligence["macro"]
    fusion: GlobalIntelligence["fusion"]
    narrative: string
    key_points: string[]
  }
  reasoning: string
}

export function computeGlobalOutputAggregation(
  inputs: GlobalOutputAggregationInputs
): GlobalOutputAggregation {
  const {
    global_intelligence,
    global_routing,
    global_weighting,
    global_execution,
    global_confidence,
    global_narrative
  } = inputs

  const packet = {
    global_score: global_intelligence.global_score,
    global_label: global_intelligence.global_label,
    global_theme: global_narrative.global_theme,
    confidence_score: global_confidence.confidence_score,
    confidence_label: global_confidence.confidence_label,
    routing: global_routing,
    weighting: global_weighting,
    execution: global_execution,
    micro: global_intelligence.micro,
    macro: global_intelligence.macro,
    fusion: global_intelligence.fusion,
    narrative: global_narrative.narrative,
    key_points: global_narrative.key_points
  }

  const reasoning = `
Global Output Aggregation Summary

- Global score: ${packet.global_score}
- Global label: ${packet.global_label}
- Global theme: ${packet.global_theme}

Confidence:
- Score: ${packet.confidence_score}
- Label: ${packet.confidence_label}

Routing:
- ${packet.routing.route_label}

Weighting:
- Position size: ${packet.weighting.position_size}

Execution:
- Action: ${packet.execution.action}
- Intensity: ${packet.execution.execution_intensity}

Narrative:
${packet.narrative}
`.trim()

  return {
    packet,
    reasoning
  }
}
