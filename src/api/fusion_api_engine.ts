// src/api/fusion_api_engine.ts

import { FusionState } from "../fusion/fusion_state_engine"
import { computeFusionState } from "../fusion/fusion_state_engine"

import { GlobalState } from "../fusion/global_state_engine"
import { FullMetaState } from "../meta/meta_state_engine"
import { GlobalSnapshot } from "../fusion/global_snapshot_engine"

export interface FusionAPIResponse {
  status: string
  timestamp: number
  fusion_state: FusionState
}

export interface FusionAPIEngine {
  getFusionState: (
    global: GlobalState,
    meta: FullMetaState,
    snapshot: GlobalSnapshot
  ) => FusionAPIResponse
}

export function createFusionAPIEngine(): FusionAPIEngine {
  return {
    getFusionState: (
      global: GlobalState,
      meta: FullMetaState,
      snapshot: GlobalSnapshot
    ): FusionAPIResponse => {
      const fusion_state = computeFusionState(global, meta, snapshot)

      return {
        status: fusion_state.fusion_status,
        timestamp: fusion_state.timestamp,
        fusion_state
      }
    }
  }
}
