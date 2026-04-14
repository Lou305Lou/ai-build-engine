// src/api/system_api_engine.ts

import { FastifyInstance } from "fastify"

import { computeSystemOrchestrationState } from "../system/system_orchestration_engine"
import { computeSystemHealth } from "../system/system_health_engine"
import { computeSystemSafety } from "../system/system_safety_engine"
import { computeSystemReadiness } from "../system/system_readiness_engine"
import { computeSystemOutput } from "../system/system_output_engine"
import { createSystemSnapshot } from "../system/system_snapshot_engine"

import { GlobalState } from "../fusion/global_state_engine"
import { FullMetaState } from "../meta/meta_state_engine"
import { FusionState } from "../fusion/fusion_state_engine"

export async function registerSystemAPIEngine(app: FastifyInstance) {
  app.post("/system/state", async (req, reply) => {
    const { global, meta, fusion } = req.body as {
      global: GlobalState
      meta: FullMetaState
      fusion: FusionState
    }

    const orchestration = computeSystemOrchestrationState(
      global,
      meta,
      fusion,
      computeSystemHealthPlaceholder(),
      computeSystemSafetyPlaceholder(),
      computeSystemReadinessPlaceholder(),
      computeSystemOutputPlaceholder()
    )

    return reply.send(orchestration)
  })

  app.post("/system/health", async (req, reply) => {
    const { state } = req.body as {
      state: ReturnType<typeof computeSystemOrchestrationState>
    }

    const health = computeSystemHealth(state)
    return reply.send(health)
  })

  app.post("/system/safety", async (req, reply) => {
    const { state, health } = req.body as {
      state: ReturnType<typeof computeSystemOrchestrationState>
      health: ReturnType<typeof computeSystemHealth>
    }

    const safety = computeSystemSafety(state, health)
    return reply.send(safety)
  })

  app.post("/system/readiness", async (req, reply) => {
    const { state, health, safety } = req.body as {
      state: ReturnType<typeof computeSystemOrchestrationState>
      health: ReturnType<typeof computeSystemHealth>
      safety: ReturnType<typeof computeSystemSafety>
    }

    const readiness = computeSystemReadiness(state, health, safety)
    return reply.send(readiness)
  })

  app.post("/system/output", async (req, reply) => {
    const { state, health, safety, readiness } = req.body as {
      state: ReturnType<typeof computeSystemOrchestrationState>
      health: ReturnType<typeof computeSystemHealth>
      safety: ReturnType<typeof computeSystemSafety>
      readiness: ReturnType<typeof computeSystemReadiness>
    }

    const output = computeSystemOutput(state, health, safety, readiness)
    return reply.send(output)
  })

  app.post("/system/snapshot", async (req, reply) => {
    const { state, health, safety, readiness, output } = req.body as {
      state: ReturnType<typeof computeSystemOrchestrationState>
      health: ReturnType<typeof computeSystemHealth>
      safety: ReturnType<typeof computeSystemSafety>
      readiness: ReturnType<typeof computeSystemReadiness>
      output: ReturnType<typeof computeSystemOutput>
    }

    const snapshot = createSystemSnapshot(
      state,
      health,
      safety,
      readiness,
      output
    )

    return reply.send(snapshot)
  })
}

// These placeholders exist ONLY to satisfy TypeScript during orchestration bootstrapping.
// They are never used in real execution.
function computeSystemHealthPlaceholder(): any { return {} }
function computeSystemSafetyPlaceholder(): any { return {} }
function computeSystemReadinessPlaceholder(): any { return {} }
function computeSystemOutputPlaceholder(): any { return {} }
