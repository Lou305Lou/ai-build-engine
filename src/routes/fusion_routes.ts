// src/routes/fusion_routes.ts

import { FastifyInstance } from "fastify"

import { computeFusionState } from "../fusion/fusion_state_engine"
import { createFusionSnapshot } from "../fusion/fusion_snapshot_engine"
import { computeFusionTelemetry } from "../fusion/fusion_telemetry_engine"
import { computeFusionSafety } from "../fusion/fusion_safety_engine"
import { computeFusionReadiness } from "../fusion/fusion_readiness_engine"
import { computeFusionOutput } from "../fusion/fusion_output_engine"

import { GlobalState } from "../fusion/global_state_engine"
import { FullMetaState } from "../meta/meta_state_engine"
import { GlobalSnapshot } from "../fusion/global_snapshot_engine"

export async function registerFusionRoutes(app: FastifyInstance) {
  // -----------------------------
  // /fusion/state
  // -----------------------------
  app.post("/fusion/state", async (req, reply) => {
    const { global, meta, snapshot } = req.body as {
      global: GlobalState
      meta: FullMetaState
      snapshot: GlobalSnapshot
    }

    const fusion = computeFusionState(global, meta, snapshot)
    return reply.send(fusion)
  })

  // -----------------------------
  // /fusion/snapshot
  // -----------------------------
  app.post("/fusion/snapshot", async (req, reply) => {
    const { global, meta, snapshot } = req.body as {
      global: GlobalState
      meta: FullMetaState
      snapshot: GlobalSnapshot
    }

    const fusion = computeFusionState(global, meta, snapshot)
    const snap = createFusionSnapshot(fusion)
    return reply.send(snap)
  })

  // -----------------------------
  // /fusion/telemetry
  // -----------------------------
  app.post("/fusion/telemetry", async (req, reply) => {
    const { global, meta, snapshot } = req.body as {
      global: GlobalState
      meta: FullMetaState
      snapshot: GlobalSnapshot
    }

    const fusion = computeFusionState(global, meta, snapshot)
    const telemetry = computeFusionTelemetry(fusion)
    return reply.send(telemetry)
  })

  // -----------------------------
  // /fusion/safety
  // -----------------------------
  app.post("/fusion/safety", async (req, reply) => {
    const { global, meta, snapshot } = req.body as {
      global: GlobalState
      meta: FullMetaState
      snapshot: GlobalSnapshot
    }

    const fusion = computeFusionState(global, meta, snapshot)
    const telemetry = computeFusionTelemetry(fusion)
    const safety = computeFusionSafety(fusion, telemetry)

    return reply.send(safety)
  })

  // -----------------------------
  // /fusion/readiness
  // -----------------------------
  app.post("/fusion/readiness", async (req, reply) => {
    const { global, meta, snapshot } = req.body as {
      global: GlobalState
      meta: FullMetaState
      snapshot: GlobalSnapshot
    }

    const fusion = computeFusionState(global, meta, snapshot)
    const telemetry = computeFusionTelemetry(fusion)
    const safety = computeFusionSafety(fusion, telemetry)
    const readiness = computeFusionReadiness(fusion, telemetry, safety)

    return reply.send(readiness)
  })

  // -----------------------------
  // /fusion/output
  // -----------------------------
  app.post("/fusion/output", async (req, reply) => {
    const { global, meta, snapshot } = req.body as {
      global: GlobalState
      meta: FullMetaState
      snapshot: GlobalSnapshot
    }

    const fusion = computeFusionState(global, meta, snapshot)
    const telemetry = computeFusionTelemetry(fusion)
    const safety = computeFusionSafety(fusion, telemetry)
    const readiness = computeFusionReadiness(fusion, telemetry, safety)
    const output = computeFusionOutput(fusion, telemetry, safety, readiness)

    return reply.send(output)
  })
}
