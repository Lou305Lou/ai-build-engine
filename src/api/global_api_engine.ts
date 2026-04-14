// src/api/global_api_engine.ts

import { GlobalState } from "../fusion/global_state_engine"
import { computeGlobalState, GlobalStateInputs } from "../fusion/global_state_engine"

export interface GlobalAPIResponse {
  status: string
  timestamp: number
  global_state: GlobalState
}

export interface GlobalAPIEngine {
  getGlobalState: (inputs: GlobalStateInputs) => GlobalAPIResponse
}

export function createGlobalAPIEngine(): GlobalAPIEngine {
  return {
    getGlobalState: (inputs: GlobalStateInputs): GlobalAPIResponse => {
      const global_state = computeGlobalState(inputs)

      return {
        status: global_state.system_status,
        timestamp: global_state.timestamp,
        global_state
      }
    }
  }
}
