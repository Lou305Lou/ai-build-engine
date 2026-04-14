// src/meta/meta_state_engine.ts

import { MetaState } from "./meta_output_engine"
import { MetaTelemetryOutput } from "./meta_telemetry_engine"
import { MetaSafetyOutput } from "./meta_safety_engine"
import { MetaReadinessOutput } from "./meta_readiness_engine"

export interface FullMetaState {
  timestamp: number

  // Core meta state
  meta: MetaState

  // Meta telemetry
  telemetry: MetaTelemetryOutput

  // Meta safety
  safety: MetaSafetyOutput

  // Meta readiness
  readiness: MetaReadinessOutput

  // Final meta system status
  meta_system_status: string

  // Summary
  summary: string
}

export function computeFullMetaState(
  meta: MetaState,
  telemetry: MetaTelemetryOutput,
  safety: MetaSafetyOutput,
  readiness: MetaReadinessOutput
): FullMetaState {
  const meta_system_status =
    safety.meta_kill_switch ? "halted" :
    !safety.meta_safe ? "unsafe" :
    readiness.meta_readiness_level === "fully_ready" ? "optimal" :
    readiness.meta_readiness_level === "ready" ? "ready" :
    readiness.meta_readiness_level === "caution" ? "caution" :
    "not_ready"

  const summary = `
Full Meta-State Summary:
- Meta Score: ${(meta.meta_score * 100).toFixed(1)}% (${meta.meta_label})
- Meta Confidence: ${(meta.meta_confidence_score * 100).toFixed(1)}% (${meta.meta_confidence_label})
- Meta Health: ${telemetry.meta_health}
- Meta Signal Quality: ${telemetry.meta_signal_quality}
- Meta Safety: ${safety.meta_safety_label}
- Meta Readiness: ${readiness.meta_readiness_level}
- Meta Action: ${meta.meta_action}
- Meta System Status: ${meta_system_status}
`.trim()

  return {
    timestamp: Date.now(),

    meta,
    telemetry,
    safety,
    readiness,

    meta_system_status,
    summary
  }
}
