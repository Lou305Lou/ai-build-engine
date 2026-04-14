// src/routes/tradingview_routes.ts

import { FastifyInstance } from "fastify"

export interface TradingViewWebhookPayload {
  ticker: string
  price: number
  side: "long" | "short" | "flat"
  timestamp: number
  raw: any
}

export async function registerTradingViewRoutes(app: FastifyInstance) {
  // ---------------------------------------
  // /tradingview/webhook
  // ---------------------------------------
  app.post("/tradingview/webhook", async (req, reply) => {
    const payload = req.body as TradingViewWebhookPayload

    // Basic validation
    if (!payload || !payload.ticker || !payload.price || !payload.side) {
      return reply.status(400).send({
        error: "Invalid TradingView payload",
        received: payload
      })
    }

    // Echo back for now — next chunks will integrate full pipeline
    return reply.send({
      status: "received",
      ticker: payload.ticker,
      price: payload.price,
      side: payload.side,
      timestamp: payload.timestamp ?? Date.now(),
      raw: payload.raw ?? null
    })
  })
}
