// src/routes/meta_routes.ts

import { FastifyInstance } from "fastify"

import { computeFullMetaState } from "../meta/meta_state_engine"
import { createMetaSnapshot } from "../meta/meta_snapshot_engine"
import { computeMetaTelemetry } from "../meta/meta_telemetry_engine"
import { computeMetaSafety } from "../meta/meta_safety_engine"
import { computeMetaReadiness } from "../meta/meta_readiness_engine"
import { computeMetaOutput } from "../meta/meta_output_engine"

import { FullMetaInput } from "../meta/meta_state_engine"

export async function registerMetaRoutes(app: FastifyInstance) {
  // -----------------------------
  // /meta/state
  // -----------------------------
  app.post("/meta/state", async (req, reply) => {
    const { input } = req.body as { input: FullMetaInput }
    const state = computeFullMetaState(input)
    return reply.send(state)
  })

  // -----------------------------
  // /meta/snapshot
  // -----------------------------
  app.post("/meta/snapshot", async (req, reply) => {
    const { input } = req.body as { input: FullMetaInput }
    const state = computeFullMetaState(input)
    const snapshot = createMetaSnapshot(state)
    return reply.send(snapshot)
  })

  // -----------------------------
  // /meta/telemetry
  // -----------------------------
  app.post("/meta/telemetry", async (req, reply) => {
    const { input } = req.body as { input: FullMetaInput }
    const state = computeFullMetaState(input)
    const telemetry = computeMetaTelemetry(state)
    return reply.send(telemetry)
  })

  // -----------------------------
  // /meta/safety
  // -----------------------------
  app.post("/meta/safety", async (req, reply) => {
    const { input } = req.body as { input: FullMetaInput }
    const state = computeFullMetaState(input)
    const telemetry = computeMetaTelemetry(state)
    const safety = computeMetaSafety(state, telemetry)
    return reply.send(safety)
  })

  // -----------------------------
  // /meta/readiness
  // -----------------------------
  app.post("/meta/readiness", async (req, reply) => {
    const { input } = req.body as { input: FullMetaInput }
    const state = computeFullMetaState(input)
    const telemetry = computeMetaTelemetry(state)
    const safety = computeMetaSafety(state, telemetry)
    const readiness = computeMetaReadiness(state, telemetry, safety)
    return reply.send(readiness)
  })

  // -----------------------------
  // /meta/output
  // -----------------------------
  app.post("/meta/output", async (req, reply) => {
    const { input } = req.body as { input: FullMetaInput }
    const state = computeFullMetaState(input)
    const telemetry = computeMetaTelemetry(state)
    const safety = computeMetaSafety(state, telemetry)
    const readiness = computeMetaReadiness(state, telemetry, safety)
    const output = computeMetaOutput(state, telemetry, safety, readiness)
    return reply.send(output)
  })
}
