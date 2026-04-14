// src/routes/tradingview_full_pipeline.ts

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

// Global Engine
import { computeGlobalState } from "../fusion/global_state_engine"
import { createGlobalSnapshot } from "../fusion/global_snapshot_engine"
import { computeGlobalTelemetry } from "../fusion/global_telemetry_engine"
import { computeGlobalSafety } from "../fusion/global_safety_engine"
import { computeGlobalReadiness } from "../fusion/global_readiness_engine"
import { computeGlobalOutput } from "../fusion/global_output_engine"

// Meta Engine
import { computeFullMetaState } from "../meta/meta_state_engine"
import { createMetaSnapshot } from "../meta/meta_snapshot_engine"
import { computeMetaTelemetry } from "../meta/meta_telemetry_engine"
import { computeMetaSafety } from "../meta/meta_safety_engine"
import { computeMetaReadiness } from "../meta/meta_readiness_engine"
import { computeMetaOutput } from "../meta/meta_output_engine"

export interface TradingViewWebhookPayload {
  ticker: string
  price: number
  side: "long" | "short" | "flat"
  timestamp: number
  raw: any
}

export async function registerTradingViewFullPipeline(app: FastifyInstance) {
  // -------------------------------------------------------
  // /tradingview/full-pipeline
  // -------------------------------------------------------
  app.post("/tradingview/full-pipeline", async (req, reply) => {
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
    // -------------------------
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
    // -------------------------
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

    // -------------------------
    // GLOBAL ENGINE PIPELINE
    // -------------------------
    const globalInput = {
      system: systemOutput,
      timestamp: Date.now()
    }

    const globalState = computeGlobalState(globalInput)
    const globalSnapshot = createGlobalSnapshot(globalState)
    const globalTelemetry = computeGlobalTelemetry(globalState)
    const globalSafety = computeGlobalSafety(globalState, globalTelemetry)
    const globalReadiness = computeGlobalReadiness(
      globalState,
      globalTelemetry,
      globalSafety
    )
    const globalOutput = computeGlobalOutput(
      globalState,
      globalTelemetry,
      globalSafety,
      globalReadiness
    )

    // -------------------------
    // META ENGINE PIPELINE
    // -------------------------
    const metaInput = {
      global: globalOutput,
      timestamp: Date.now()
    }

    const metaState = computeFullMetaState(metaInput)
    const metaSnapshot = createMetaSnapshot(metaState)
    const metaTelemetry = computeMetaTelemetry(metaState)
    const metaSafety = computeMetaSafety(metaState, metaTelemetry)
    const metaReadiness = computeMetaReadiness(
      metaState,
      metaTelemetry,
      metaSafety
    )
    const metaOutput = computeMetaOutput(
      metaState,
      metaTelemetry,
      metaSafety,
      metaReadiness
    )

    return reply.send({
      status: "full-pipeline-processed",

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
      },

      global: {
        state: globalState,
        snapshot: globalSnapshot,
        telemetry: globalTelemetry,
        safety: globalSafety,
        readiness: globalReadiness,
        output: globalOutput
      },

      meta: {
        state: metaState,
        snapshot: metaSnapshot,
        telemetry: metaTelemetry,
        safety: metaSafety,
        readiness: metaReadiness,
        output: metaOutput
      }
    })
  })
}
