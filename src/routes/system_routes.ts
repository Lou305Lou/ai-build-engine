// src/routes/system_routes.ts

import { FastifyInstance } from "fastify"

import { computeSystemState } from "../system/system_state_engine"
import { createSystemSnapshot } from "../system/system_snapshot_engine"
import { computeSystemTelemetry } from "../system/system_telemetry_engine"
import { computeSystemSafety } from "../system/system_safety_engine"
import { computeSystemReadiness } from "../system/system_readiness_engine"
import { computeSystemOutput } from "../system/system_output_engine"

import { SystemStateInput } from "../system/system_state_engine"

export async function registerSystemRoutes(app: FastifyInstance) {
  // -----------------------------
  // /system/state
  // -----------------------------
  app.post("/system/state", async (req, reply) => {
    const { input } = req.body as { input: SystemStateInput }
    const state = computeSystemState(input)
    return reply.send(state)
  })

  // -----------------------------
  // /system/snapshot
  // -----------------------------
  app.post("/system/snapshot", async (req, reply) => {
    const { input } = req.body as { input: SystemStateInput }
    const state = computeSystemState(input)
    const snapshot = createSystemSnapshot(state)
    return reply.send(snapshot)
  })

  // -----------------------------
  // /system/telemetry
  // -----------------------------
  app.post("/system/telemetry", async (req, reply) => {
    const { input } = req.body as { input: SystemStateInput }
    const state = computeSystemState(input)
    const telemetry = computeSystemTelemetry(state)
    return reply.send(telemetry)
  })

  // -----------------------------
  // /system/safety
  // -----------------------------
  app.post("/system/safety", async (req, reply) => {
    const { input } = req.body as { input: SystemStateInput }
    const state = computeSystemState(input)
    const telemetry = computeSystemTelemetry(state)
    const safety = computeSystemSafety(state, telemetry)
    return reply.send(safety)
  })

  // -----------------------------
  // /system/readiness
  // -----------------------------
  app.post("/system/readiness", async (req, reply) => {
    const { input } = req.body as { input: SystemStateInput }
    const state = computeSystemState(input)
    const telemetry = computeSystemTelemetry(state)
    const safety = computeSystemSafety(state, telemetry)
    const readiness = computeSystemReadiness(state, telemetry, safety)
    return reply.send(readiness)
  })

  // -----------------------------
  // /system/output
  // -----------------------------
  app.post("/system/output", async (req, reply) => {
    const { input } = req.body as { input: SystemStateInput }
    const state = computeSystemState(input)
    const telemetry = computeSystemTelemetry(state)
    const safety = computeSystemSafety(state, telemetry)
    const readiness = computeSystemReadiness(state, telemetry, safety)
    const output = computeSystemOutput(state, telemetry, safety, readiness)
    return reply.send(output)
  })
}
