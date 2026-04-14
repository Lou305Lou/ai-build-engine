// src/fusion/global_state_engine.ts

import { GlobalIntelligence } from "./global_intelligence_engine"
import { GlobalRoutingOutput } from "./global_routing_engine"
import { GlobalWeightingOutput } from "./global_weighting_engine"
import { GlobalExecutionOutput } from "./global_execution_engine"
import { GlobalConfidenceOutput } from "./global_confidence_engine"
import { GlobalSafetyOutput } from "./global_safety_engine"
import { GlobalReadinessOutput } from "./global_readiness_engine"
import { GlobalTelemetryOutput } from "./global_telemetry_engine"
import { GlobalNarrativeOutput } from "./global_narrative_engine"

export interface GlobalStateInputs {
  global_intelligence: GlobalIntelligence
  global_routing: GlobalRoutingOutput
  global_weighting: GlobalWeightingOutput
  global_execution: GlobalExecutionOutput
  global_confidence: GlobalConfidenceOutput
  global_safety: GlobalSafetyOutput
  global_readiness: GlobalReadinessOutput
  global_telemetry: GlobalTelemetryOutput
  global_narrative: GlobalNarrativeOutput
}

export interface GlobalState {
  timestamp: number
  global_score: number
  global_label: string
  global_theme: string

  intelligence: GlobalIntelligence
  routing: GlobalRoutingOutput
  weighting: GlobalWeightingOutput
  execution: GlobalExecutionOutput
  confidence: GlobalConfidenceOutput
  safety: GlobalSafetyOutput
  readiness: GlobalReadinessOutput
  telemetry: GlobalTelemetryOutput
  narrative: GlobalNarrativeOutput

  system_status: string
  reasoning: string
}

export function computeGlobalState(inputs: GlobalStateInputs): GlobalState {
  const {
    global_intelligence,
    global_routing,
    global_weighting,
    global_execution,
    global_confidence,
    global_safety,
    global_readiness,
    global_telemetry,
    global_narrative
  } = inputs

  const system_status =
    global_safety.kill_switch ? "halted" :
    !global_safety.safe_to_execute ? "unsafe" :
    global_readiness.readiness_level === "fully_ready" ? "optimal" :
    global_readiness.readiness_level === "ready" ? "ready" :
    global_readiness.readiness_level === "caution" ? "caution" :
    "not_ready"

  const reasoning = `
Global State Summary

Global:
- Score: ${global_intelligence.global_score}
- Label: ${global_intelligence.global_label}
- Theme: ${global_narrative.global_theme}

Safety:
- Safe to execute: ${global_safety.safe_to_execute}
- Kill-switch: ${global_safety.kill_switch}

Readiness:
- Level: ${global_readiness.readiness_level}
- Score: ${global_readiness.readiness_score}

Telemetry:
- System health: ${global_telemetry.system_health}
- Signal quality: ${global_telemetry.signal_quality}
- Execution readiness: ${global_telemetry.execution_readiness}

Execution:
- Action: ${global_execution.action}
- Intensity: ${global_execution.execution_intensity}

System status: ${system_status}
`.trim()

  return {
    timestamp: Date.now(),
    global_score: global_intelligence.global_score,
    global_label: global_intelligence.global_label,
    global_theme: global_narrative.global_theme,

    intelligence: global_intelligence,
    routing: global_routing,
    weighting: global_weighting,
    execution: global_execution,
    confidence: global_confidence,
    safety: global_safety,
    readiness: global_readiness,
    telemetry: global_telemetry,
    narrative: global_narrative,

    system_status,
    reasoning
  }
}
