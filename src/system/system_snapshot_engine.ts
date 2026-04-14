// src/system/system_snapshot_engine.ts

import { SystemOrchestrationState } from "./system_orchestration_engine"
import { SystemHealthOutput } from "./system_health_engine"
import { SystemSafetyOutput } from "./system_safety_engine"
import { SystemReadinessOutput } from "./system_readiness_engine"
import { SystemOutput } from "./system_output_engine"

export interface SystemSnapshot {
  timestamp: number

  // System-level status
  system_status: string
  system_health: string
  system_safety: string
  system_readiness: string

  // Final system output
  system_action: string
  system_intensity: number
  system_confidence: number
  risk_level: string

  // Ultra-compressed metrics
  global_score: number
  meta_score: number
  fusion_confidence: number
  volatility: number
  divergence: number
  uncertainty: number

  // Summary string
  summary: string
}

export function createSystemSnapshot(
  state: SystemOrchestrationState,
  health: SystemHealthOutput,
  safety: SystemSafetyOutput,
  readiness: SystemReadinessOutput,
  output: SystemOutput
): SystemSnapshot {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const global_score = clamp(state.global.global_score)
  const meta_score = clamp(state.meta.meta.meta_score)
  const fusion_confidence = clamp(output.system_confidence)

  const volatility = clamp(health.system_volatility_stress)
  const divergence = clamp(state.fusion.global.intelligence.fusion.divergence)
  const uncertainty = clamp(state.meta.meta.meta_uncertainty)

  const summary = `
System Snapshot:
- Status: ${state.system_status}
- Health: ${health.system_health}
- Safety: ${safety.system_safety_label}
- Readiness: ${readiness.system_readiness_level}

Output:
- Action: ${output.system_action}
- Intensity: ${(output.system_intensity * 100).toFixed(1)}%
- Confidence: ${(output.system_confidence * 100).toFixed(1)}%
- Risk: ${output.risk_level}

Metrics:
- Global Score: ${(global_score * 100).toFixed(1)}%
- Meta Score: ${(meta_score * 100).toFixed(1)}%
- Fusion Confidence: ${(fusion_confidence * 100).toFixed(1)}%
- Volatility: ${(volatility * 100).toFixed(1)}%
- Divergence: ${(divergence * 100).toFixed(1)}%
- Uncertainty: ${(uncertainty * 100).toFixed(1)}%
`.trim()

  return {
    timestamp: Date.now(),

    system_status: state.system_status,
    system_health: health.system_health,
    system_safety: safety.system_safety_label,
    system_readiness: readiness.system_readiness_level,

    system_action: output.system_action,
    system_intensity: output.system_intensity,
    system_confidence: output.system_confidence,
    risk_level: output.risk_level,

    global_score,
    meta_score,
    fusion_confidence,
    volatility,
    divergence,
    uncertainty,

    summary
  }
}
