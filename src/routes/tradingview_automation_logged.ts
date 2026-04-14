// src/routes/tradingview_automation_logged.ts

import { FastifyInstance } from "fastify"
import { RawTradingViewPayload } from "../automation/tv_input_normalizer"
import { runLoggedAutomationPipeline } from "../automation/logs/automation_pipeline_runner"

/**
 * TradingView → Automation route WITH full logging enabled.
 * This is the production-ready route for real automation.
 */
export async function registerTradingViewLoggedAutomationRoute(app: FastifyInstance) {
  app.post("/tradingview/automation/logged", async (req, reply) => {
    const payload = req.body as RawTradingViewPayload

    if (!payload) {
      return reply.status(400).send({
        error: "Missing TradingView payload"
      })
    }

    try {
      const result = await runLoggedAutomationPipeline(payload)

      return reply.send({
        status: "automation-complete",
        logged: true,
        pipeline: result
      })
    } catch (err: any) {
      return reply.status(500).send({
        error: "Logged automation pipeline failed",
        details: err?.message ?? "Unknown error"
      })
    }
  })
}
