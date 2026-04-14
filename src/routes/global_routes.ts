// src/routes/global_routes.ts

import { FastifyInstance } from "fastify"

import { computeGlobalState } from "../fusion/global_state_engine"
import { createGlobalSnapshot } from "../fusion/global_snapshot_engine"
import { computeGlobalTelemetry } from "../fusion/global_telemetry_engine"
import { computeGlobalSafety } from "../fusion/global_safety_engine"
import { computeGlobalReadiness } from "../fusion/global_readiness_engine"
import { computeGlobalOutput } from "../fusion/global_output_engine"

import { GlobalStateInput } from "../fusion/global_state_engine"

export async function registerGlobalRoutes(app: FastifyInstance) {
  // -----------------------------
  // /global/state
  // -----------------------------
  app.post("/global/state", async (req, reply) => {
    const { input } = req.body as { input: GlobalStateInput }
    const state = computeGlobalState(input)
    return reply.send(state)
  })

  // -----------------------------
  // /global/snapshot
  // -----------------------------
  app.post("/global/snapshot", async (req, reply) => {
    const { input } = req.body as { input: GlobalStateInput }
    const state = computeGlobalState(input)
    const snapshot = createGlobalSnapshot(state)
    return reply.send(snapshot)
  })

  // -----------------------------
  // /global/telemetry
  // -----------------------------
  app.post("/global/telemetry", async (req, reply) => {
    const { input } = req.body as { input: GlobalStateInput }
    const state = computeGlobalState(input)
    const telemetry = computeGlobalTelemetry(state)
    return reply.send(telemetry)
  })

  // -----------------------------
  // /global/safety
  // -----------------------------
  app.post("/global/safety", async (req, reply) => {
    const { input } = req.body as { input: GlobalStateInput }
    const state = computeGlobalState(input)
    const telemetry = computeGlobalTelemetry(state)
    const safety = computeGlobalSafety(state, telemetry)
    return reply.send(safety)
  })

  // -----------------------------
  // /global/readiness
  // -----------------------------
  app.post("/global/readiness", async (req, reply) => {
    const { input } = req.body as { input: GlobalStateInput }
    const state = computeGlobalState(input)
    const telemetry = computeGlobalTelemetry(state)
    const safety = computeGlobalSafety(state, telemetry)
    const readiness = computeGlobalReadiness(state, telemetry, safety)
    return reply.send(readiness)
  })

  // -----------------------------
  // /global/output
  // -----------------------------
  app.post("/global/output", async (req, reply) => {
    const { input } = req.body as { input: GlobalStateInput }
    const state = computeGlobalState(input)
    const telemetry = computeGlobalTelemetry(state)
    const safety = computeGlobalSafety(state, telemetry)
    const readiness = computeGlobalReadiness(state, telemetry, safety)
    const output = computeGlobalOutput(state, telemetry, safety, readiness)
    return reply.send(output)
  })
}
