// src/system/system_output_engine.ts

import { SystemOrchestrationState } from "./system_orchestration_engine"
import { SystemHealthOutput } from "./system_health_engine"
import { SystemSafetyOutput } from "./system_safety_engine"
import { SystemReadinessOutput } from "./system_readiness_engine"

export interface SystemOutput {
  timestamp: number

  system_action: string
  system_intensity: number
  system_confidence: number

  risk_level: string
  execution_allowed: boolean
  override_signal: boolean

  summary: string
}

export function computeSystemOutput(
  state: SystemOrchestrationState,
  health: SystemHealthOutput,
  safety: SystemSafetyOutput,
  readiness: SystemReadinessOutput
): SystemOutput {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const fusion_action = state.output.fusion_action
  const fusion_intensity = clamp(state.output.fusion_intensity)
  const fusion_confidence = clamp(state.output.fusion_confidence)

  const safe = safety.system_safe && !safety.system_kill_switch
  const ready = readiness.system_readiness_level !== "not_ready"

  // System action selection hierarchy
  const system_action =
    !safe ? "halt" :
    !ready ? "protect" :
    fusion_action === "halt" ? "halt" :
    fusion_action === "protect" ? "protect" :
    fusion_action === "soften" ? "soften" :
    fusion_action === "reinforce" ? "reinforce" :
    fusion_action

  // System intensity blends fusion intensity + system readiness
  const system_intensity = Number(
    clamp(
      0.60 * fusion_intensity +
      0.40 * readiness.system_readiness_score
    ).toFixed(4)
  )

  // System confidence blends fusion confidence + system health
  const system_confidence = Number(
    clamp(
      0.50 * fusion_confidence +
      0.50 * health.system_confidence_stability
    ).toFixed(4)
  )

  // Risk level
  const risk_level =
    health.system_volatility_stress > 0.75 ? "extreme" :
    health.system_volatility_stress > 0.60 ? "high" :
    health.system_volatility_stress > 0.40 ? "medium" :
    "low"

  // Execution allowed?
  const execution_allowed =
    safe &&
    ready &&
    readiness.can_execute &&
    system_action !== "halt"

  // Override signal
  const override_signal =
    safe &&
    ready &&
    readiness.can_override &&
    system_action !== "halt"

  const summary = `
System Output:
- Action: ${system_action}
- Intensity: ${(system_intensity * 100).toFixed(1)}%
- Confidence: ${(system_confidence * 100).toFixed(1)}%
- Risk: ${risk_level}
- Execution Allowed: ${execution_allowed}
- Override Signal: ${override_signal}
`.trim()

  return {
    timestamp: Date.now(),
    system_action,
    system_intensity,
    system_confidence,
    risk_level,
    execution_allowed,
    override_signal,
    summary
  }
}
