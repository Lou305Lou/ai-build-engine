// src/fusion/fusion_snapshot_engine.ts

import { FusionState } from "./fusion_state_engine"

export interface FusionSnapshot {
  timestamp: number

  // High-level fusion status
  fusion_status: string

  // Global layer summary
  global_score: number
  global_label: string
  global_action: string
  global_intensity: string

  // Meta layer summary
  meta_score: number
  meta_confidence: number
  meta_action: string
  meta_readiness: string
  meta_safety: string

  // Combined risk + stability
  alignment: number
  divergence: number
  volatility: number
  uncertainty: number

  // Ultra-compressed summary string
  summary: string
}

export function createFusionSnapshot(fusion: FusionState): FusionSnapshot {
  const { global, meta, snapshot } = fusion

  const fusion_status = fusion.fusion_status

  const global_score = global.global_score
  const global_label = global.global_label
  const global_action = global.execution.action
  const global_intensity = global.execution.execution_intensity

  const meta_score = meta.meta.meta_score
  const meta_confidence = meta.meta.meta_confidence_score
  const meta_action = meta.meta.meta_action
  const meta_readiness = meta.readiness.meta_readiness_level
  const meta_safety = meta.safety.meta_safety_label

  const alignment = global.intelligence.fusion.alignment
  const divergence = global.intelligence.fusion.divergence
  const volatility = global.telemetry.volatility_stress
  const uncertainty = meta.meta.meta_uncertainty

  const summary = `
Fusion Snapshot:
- Fusion Status: ${fusion_status}
- Global: ${global_label.toUpperCase()} (${(global_score * 100).toFixed(1)}%), Action: ${global_action} (${global_intensity})
- Meta: Score ${(meta_score * 100).toFixed(1)}%, Conf ${(meta_confidence * 100).toFixed(1)}%, Action: ${meta_action}
- Readiness: ${meta_readiness}, Safety: ${meta_safety}
- Risk: Align ${(alignment * 100).toFixed(1)}%, Div ${(divergence * 100).toFixed(1)}%, Vol ${(volatility * 100).toFixed(1)}%, Unc ${(uncertainty * 100).toFixed(1)}%
`.trim()

  return {
    timestamp: Date.now(),
    fusion_status,

    global_score,
    global_label,
    global_action,
    global_intensity,

    meta_score,
    meta_confidence,
    meta_action,
    meta_readiness,
    meta_safety,

    alignment,
    divergence,
    volatility,
    uncertainty,

    summary
  }
}
