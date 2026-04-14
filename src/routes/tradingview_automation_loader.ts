// src/routes/tradingview_automation_loader.ts

import { FastifyInstance } from "fastify"
import { registerTradingViewAutomationRoute } from "./tradingview_automation"

/**
 * Registers the TradingView → Automation pipeline route.
 * This loader keeps the routing architecture modular and clean.
 */
export async function registerTradingViewAutomationLoader(app: FastifyInstance) {
  await app.register(registerTradingViewAutomationRoute)
}
