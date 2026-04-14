// src/system/system_orchestration_engine.ts

import { GlobalState } from "../fusion/global_state_engine"
import { FullMetaState } from "../meta/meta_state_engine"
import { FusionState } from "../fusion/fusion_state_engine"

import { FusionTelemetryOutput } from "../fusion/fusion_telemetry_engine"
import { FusionSafetyOutput } from "../fusion/fusion_safety_engine"
import { FusionReadinessOutput } from "../fusion/fusion_readiness_engine"
import { FusionOutput } from "../fusion/fusion_output_engine"

export interface SystemOrchestrationState {
  timestamp: number

  // Layer states
  global: GlobalState
  meta: FullMetaState
  fusion: FusionState

  // Fusion-level evaluations
  telemetry: FusionTelemetryOutput
  safety: FusionSafetyOutput
  readiness: FusionReadinessOutput
  output: FusionOutput

  // System-level status
  system_status: string
  system_ready: boolean
  system_safe: boolean

  // System summary
  summary: string
}

export function computeSystemOrchestrationState(
  global: GlobalState,
  meta: FullMetaState,
  fusion: FusionState,
  telemetry: FusionTelemetryOutput,
  safety: FusionSafetyOutput,
  readiness: FusionReadinessOutput,
  output: FusionOutput
): SystemOrchestrationState {
  const system_safe = safety.fusion_safe && !safety.fusion_kill_switch
  const system_ready =
    readiness.fusion_readiness_level === "fully_ready" ||
    readiness.fusion_readiness_level === "ready"

  const system_status =
    !system_safe ? "unsafe" :
    !system_ready ? "not_ready" :
    output.fusion_action === "halt" ? "halted" :
    output.fusion_action === "protect" ? "caution" :
    "operational"

  const summary = `
System Orchestration Summary:
- System Status: ${system_status}
- Safe: ${system_safe}
- Ready: ${system_ready}

Fusion Output:
- Action: ${output.fusion_action}
- Intensity: ${(output.fusion_intensity * 100).toFixed(1)}%
- Confidence: ${(output.fusion_confidence * 100).toFixed(1)}%

Fusion Health:
- Health: ${telemetry.fusion_health}
- Signal Quality: ${telemetry.fusion_signal_quality}
- Volatility Stress: ${(telemetry.fusion_volatility_stress * 100).toFixed(1)}%

Fusion Safety:
- Label: ${safety.fusion_safety_label}
- Kill Switch: ${safety.fusion_kill_switch}

Fusion Readiness:
- Level: ${readiness.fusion_readiness_level}
`.trim()

  return {
    timestamp: Date.now(),

    global,
    meta,
    fusion,

    telemetry,
    safety,
    readiness,
    output,

    system_status,
    system_ready,
    system_safe,

    summary
  }
}
