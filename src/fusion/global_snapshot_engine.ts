// src/fusion/global_snapshot_engine.ts

import { GlobalState } from "./global_state_engine"

export interface GlobalSnapshot {
  timestamp: number
  score: number
  label: string
  theme: string

  action: string
  intensity: string

  exposure: number
  hedge: number

  confidence: number
  system_status: string

  signal_quality: string
  system_health: string

  micro_score: number
  macro_score: number

  alignment: number
  divergence: number

  summary: string
}

export function createGlobalSnapshot(state: GlobalState): GlobalSnapshot {
  const {
    global_score,
    global_label,
    global_theme,
    execution,
    weighting,
    confidence,
    telemetry,
    safety,
    readiness,
    intelligence
  } = state

  const snapshot: GlobalSnapshot = {
    timestamp: state.timestamp,
    score: global_score,
    label: global_label,
    theme: global_theme,

    action: execution.action,
    intensity: execution.execution_intensity,

    exposure: weighting.position_size,
    hedge: weighting.hedge_ratio,

    confidence: confidence.confidence_score,
    system_status: state.system_status,

    signal_quality: telemetry.signal_quality,
    system_health: telemetry.system_health,

    micro_score: intelligence.micro.final_score,
    macro_score: intelligence.macro.final_macro_score,

    alignment: intelligence.fusion.alignment,
    divergence: intelligence.fusion.divergence,

    summary: `
Global Snapshot:
- ${global_label.toUpperCase()} (${(global_score * 100).toFixed(1)}%)
- Action: ${execution.action} (${execution.execution_intensity})
- Exposure: ${(weighting.position_size * 100).toFixed(1)}%
- Hedge: ${(weighting.hedge_ratio * 100).toFixed(1)}%
- Confidence: ${(confidence.confidence_score * 100).toFixed(1)}%
- System: ${state.system_status}
- Signal Quality: ${telemetry.signal_quality}
- Health: ${telemetry.system_health}
`.trim()
  }

  return snapshot
}
