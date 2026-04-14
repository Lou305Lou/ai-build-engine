// src/routes/tradingview_fusion_bridge.ts

import { FastifyInstance } from "fastify"

import { computeFusionState } from "../fusion/fusion_state_engine"
import { createFusionSnapshot } from "../fusion/fusion_snapshot_engine"
import { computeFusionTelemetry } from "../fusion/fusion_telemetry_engine"
import { computeFusionSafety } from "../fusion/fusion_safety_engine"
import { computeFusionReadiness } from "../fusion/fusion_readiness_engine"
import { computeFusionOutput } from "../fusion/fusion_output_engine"

export interface TradingViewWebhookPayload {
  ticker: string
  price: number
  side: "long" | "short" | "flat"
  timestamp: number
  raw: any
}

export async function registerTradingViewFusionBridge(app: FastifyInstance) {
  // -------------------------------------------------------
  // /tradingview/fusion
  // -------------------------------------------------------
  app.post("/tradingview/fusion", async (req, reply) => {
    const payload = req.body as TradingViewWebhookPayload

    // Basic validation
    if (!payload || !payload.ticker || !payload.price || !payload.side) {
      return reply.status(400).send({
        error: "Invalid TradingView payload",
        received: payload
      })
    }

    // Convert TradingView payload → Fusion input
    const fusionInput = {
      symbol: payload.ticker,
      price: payload.price,
      direction: payload.side,
      timestamp: payload.timestamp ?? Date.now(),
      metadata: payload.raw ?? {}
    }

    // Run Fusion Engine
    const state = computeFusionState(fusionInput)
    const snapshot = createFusionSnapshot(state)
    const telemetry = computeFusionTelemetry(state)
    const safety = computeFusionSafety(state, telemetry)
    const readiness = computeFusionReadiness(state, telemetry, safety)
    const output = computeFusionOutput(state, telemetry, safety, readiness)

    return reply.send({
      status: "fusion-processed",
      fusion_state: state,
      fusion_snapshot: snapshot,
      fusion_telemetry: telemetry,
      fusion_safety: safety,
      fusion_readiness: readiness,
      fusion_output: output
    })
  })
}
