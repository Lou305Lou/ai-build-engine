// src/routes/tradingview_automation.ts

import { FastifyInstance } from "fastify"
import { RawTradingViewPayload } from "../automation/tv_input_normalizer"
import { runFullAutomationPipeline } from "../automation/automation_orchestrator"

export async function registerTradingViewAutomationRoute(app: FastifyInstance) {
  app.post("/tradingview/automation", async (req, reply) => {
    const payload = req.body as RawTradingViewPayload

    if (!payload) {
      return reply.status(400).send({
        error: "Missing TradingView payload"
      })
    }

    try {
      const result = runFullAutomationPipeline(payload)

      return reply.send({
        status: "automation-complete",
        pipeline: result
      })
    } catch (err: any) {
      return reply.status(500).send({
        error: "Automation pipeline failed",
        details: err?.message ?? "Unknown error"
      })
    }
  })
}
