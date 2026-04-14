// src/fusion/fusion_state_engine.ts

import { GlobalState } from "./global_state_engine"
import { FullMetaState } from "../meta/meta_state_engine"
import { GlobalSnapshot } from "./global_snapshot_engine"

export interface FusionState {
  timestamp: number

  // Global layer
  global: GlobalState

  // Meta layer
  meta: FullMetaState

  // Snapshot layer
  snapshot: GlobalSnapshot

  // Fusion-level system status
  fusion_status: string

  // High-level fusion summary
  summary: string
}

export function computeFusionState(
  global: GlobalState,
  meta: FullMetaState,
  snapshot: GlobalSnapshot
): FusionState {
  const fusion_status =
    meta.meta_system_status === "halted" ? "halted" :
    global.system_status === "halted" ? "halted" :
    meta.meta_system_status === "unsafe" ? "unsafe" :
    global.system_status === "unsafe" ? "unsafe" :
    meta.meta_system_status === "caution" ? "caution" :
    global.system_status === "caution" ? "caution" :
    meta.meta_system_status === "ready" && global.system_status === "ready" ? "ready" :
    meta.meta_system_status === "optimal" && global.system_status === "optimal" ? "optimal" :
    "mixed"

  const summary = `
Fusion State Summary:
- Global Status: ${global.system_status}
- Meta Status: ${meta.meta_system_status}
- Fusion Status: ${fusion_status}

Global:
- Score: ${(global.global_score * 100).toFixed(1)}%
- Label: ${global.global_label}
- Action: ${global.execution.action} (${global.execution.execution_intensity})

Meta:
- Meta Score: ${(meta.meta.meta_score * 100).toFixed(1)}%
- Meta Confidence: ${(meta.meta.meta_confidence_score * 100).toFixed(1)}%
- Meta Action: ${meta.meta.meta_action}

Snapshot:
- ${snapshot.summary}
`.trim()

  return {
    timestamp: Date.now(),
    global,
    meta,
    snapshot,
    fusion_status,
    summary
  }
}
