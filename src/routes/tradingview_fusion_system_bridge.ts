// src/routes/tradingview_fusion_system_bridge.ts

import { FastifyInstance } from "fastify"

// Fusion Engine
import { computeFusionState } from "../fusion/fusion_state_engine"
import { createFusionSnapshot } from "../fusion/fusion_snapshot_engine"
import { computeFusionTelemetry } from "../fusion/fusion_telemetry_engine"
import { computeFusionSafety } from "../fusion/fusion_safety_engine"
import { computeFusionReadiness } from "../fusion/fusion_readiness_engine"
import { computeFusionOutput } from "../fusion/fusion_output_engine"

// System Engine
import { computeSystemState } from "../system/system_state_engine"
import { createSystemSnapshot } from "../system/system_snapshot_engine"
import { computeSystemTelemetry } from "../system/system_telemetry_engine"
import { computeSystemSafety } from "../system/system_safety_engine"
import { computeSystemReadiness } from "../system/system_readiness_engine"
import { computeSystemOutput } from "../system/system_output_engine"

export interface TradingViewWebhookPayload {
  ticker: string
  price: number
  side: "long" | "short" | "flat"
  timestamp: number
  raw: any
}

export async function registerTradingViewFusionSystemBridge(app: FastifyInstance) {
  // -------------------------------------------------------
  // /tradingview/fusion-system
  // -------------------------------------------------------
  app.post("/tradingview/fusion-system", async (req, reply) => {
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

    // -------------------------
    // FUSION ENGINE PIPELINE
    --------------------------
    const fusionState = computeFusionState(fusionInput)
    const fusionSnapshot = createFusionSnapshot(fusionState)
    const fusionTelemetry = computeFusionTelemetry(fusionState)
    const fusionSafety = computeFusionSafety(fusionState, fusionTelemetry)
    const fusionReadiness = computeFusionReadiness(
      fusionState,
      fusionTelemetry,
      fusionSafety
    )
    const fusionOutput = computeFusionOutput(
      fusionState,
      fusionTelemetry,
      fusionSafety,
      fusionReadiness
    )

    // -------------------------
    // SYSTEM ENGINE PIPELINE
    // (Fusion output → System input)
    --------------------------
    const systemInput = {
      fusion: fusionOutput,
      timestamp: Date.now()
    }

    const systemState = computeSystemState(systemInput)
    const systemSnapshot = createSystemSnapshot(systemState)
    const systemTelemetry = computeSystemTelemetry(systemState)
    const systemSafety = computeSystemSafety(systemState, systemTelemetry)
    const systemReadiness = computeSystemReadiness(
      systemState,
      systemTelemetry,
      systemSafety
    )
    const systemOutput = computeSystemOutput(
      systemState,
      systemTelemetry,
      systemSafety,
      systemReadiness
    )

    return reply.send({
      status: "fusion-system-processed",

      fusion: {
        state: fusionState,
        snapshot: fusionSnapshot,
        telemetry: fusionTelemetry,
        safety: fusionSafety,
        readiness: fusionReadiness,
        output: fusionOutput
      },

      system: {
        state: systemState,
        snapshot: systemSnapshot,
        telemetry: systemTelemetry,
        safety: systemSafety,
        readiness: systemReadiness,
        output: systemOutput
      }
    })
  })
}
