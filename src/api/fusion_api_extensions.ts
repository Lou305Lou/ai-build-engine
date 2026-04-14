// src/api/fusion_api_extensions.ts

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

export async function registerFusionAPIExtensions(app: FastifyInstance) {
  app.post("/fusion/state", async (req, reply) => {
    const { global, meta, snapshot } = req.body as {
      global: GlobalState
      meta: FullMetaState
      snapshot: GlobalSnapshot
    }

    const fusion = computeFusionState(global, meta, snapshot)
    return reply.send(fusion)
  })

  app.post("/fusion/snapshot", async (req, reply) => {
    const { fusion } = req.body as { fusion: ReturnType<typeof computeFusionState> }
    const snap = createFusionSnapshot(fusion)
    return reply.send(snap)
  })

  app.post("/fusion/telemetry", async (req, reply) => {
    const { fusion } = req.body as { fusion: ReturnType<typeof computeFusionState> }
    const telemetry = computeFusionTelemetry(fusion)
    return reply.send(telemetry)
  })

  app.post("/fusion/safety", async (req, reply) => {
    const { fusion, telemetry } = req.body as {
      fusion: ReturnType<typeof computeFusionState>
      telemetry: ReturnType<typeof computeFusionTelemetry>
    }

    const safety = computeFusionSafety(fusion, telemetry)
    return reply.send(safety)
  })

  app.post("/fusion/readiness", async (req, reply) => {
    const { fusion, telemetry, safety } = req.body as {
      fusion: ReturnType<typeof computeFusionState>
      telemetry: ReturnType<typeof computeFusionTelemetry>
      safety: ReturnType<typeof computeFusionSafety>
    }

    const readiness = computeFusionReadiness(fusion, telemetry, safety)
    return reply.send(readiness)
  })

  app.post("/fusion/output", async (req, reply) => {
    const { fusion, telemetry, safety, readiness } = req.body as {
      fusion: ReturnType<typeof computeFusionState>
      telemetry: ReturnType<typeof computeFusionTelemetry>
      safety: ReturnType<typeof computeFusionSafety>
      readiness: ReturnType<typeof computeFusionReadiness>
    }

    const output = computeFusionOutput(fusion, telemetry, safety, readiness)
    return reply.send(output)
  })
}
