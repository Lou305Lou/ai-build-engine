// src/fusion/fusion_output_engine.ts

import { FusionState } from "./fusion_state_engine"
import { FusionTelemetryOutput } from "./fusion_telemetry_engine"
import { FusionSafetyOutput } from "./fusion_safety_engine"
import { FusionReadinessOutput } from "./fusion_readiness_engine"

export interface FusionOutput {
  timestamp: number

  fusion_action: string
  fusion_intensity: number
  fusion_confidence: number

  risk_level: string
  override_signal: boolean
  execution_allowed: boolean

  summary: string
}

export function computeFusionOutput(
  fusion: FusionState,
  telemetry: FusionTelemetryOutput,
  safety: FusionSafetyOutput,
  readiness: FusionReadinessOutput
): FusionOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  // Base signals from global + meta
  const global_action = fusion.global.execution.action
  const global_intensity = fusion.global.execution.execution_intensity

  const meta_action = fusion.meta.meta.meta_action
  const meta_confidence = clamp(fusion.meta.meta.meta_confidence_score)

  const fusion_health = telemetry.fusion_health
  const fusion_signal_quality = telemetry.fusion_signal_quality

  const safe = safety.fusion_safe && !safety.fusion_kill_switch
  const ready = readiness.fusion_readiness_level !== "not_ready"

  // Fusion action selection hierarchy
  const fusion_action =
    !safe ? "halt" :
    !ready ? "protect" :
    meta_action === "block" ? "protect" :
    meta_action === "protect" ? "protect" :
    meta_action === "soften" ? "soften" :
    meta_action === "reinforce" ? global_action :
    global_action

  // Fusion intensity blends global intensity + meta confidence
  const fusion_intensity = Number(
    clamp(
      0.60 * global_intensity +
      0.40 * meta_confidence
    ).toFixed(4)
  )

  // Fusion confidence blends global + meta + telemetry
  const fusion_confidence = Number(
    clamp(
      0.40 * meta_confidence +
      0.30 * fusion.global.global_score +
      0.30 * (1 - telemetry.fusion_volatility_stress)
    ).toFixed(4)
  )

  // Risk level
  const risk_level =
    telemetry.fusion_volatility_stress > 0.75 ? "extreme" :
    telemetry.fusion_volatility_stress > 0.60 ? "high" :
    telemetry.fusion_volatility_stress > 0.40 ? "medium" :
    "low"

  // Override signal
  const override_signal =
    readiness.can_override &&
    safe &&
    ready &&
    fusion_action !== "halt"

  // Execution allowed?
  const execution_allowed =
    safe &&
    ready &&
    readiness.can_execute &&
    fusion_action !== "halt"

  const summary = `
Fusion Output:
- Action: ${fusion_action}
- Intensity: ${(fusion_intensity * 100).toFixed(1)}%
- Confidence: ${(fusion_confidence * 100).toFixed(1)}%
- Risk: ${risk_level}
- Override: ${override_signal}
- Execution Allowed: ${execution_allowed}
`.trim()

  return {
    timestamp: Date.now(),
    fusion_action,
    fusion_intensity,
    fusion_confidence,
    risk_level,
    override_signal,
    execution_allowed,
    summary
  }
}
