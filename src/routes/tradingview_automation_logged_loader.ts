// src/routes/tradingview_automation_logged_loader.ts

import { FastifyInstance } from "fastify"
import { registerTradingViewLoggedAutomationRoute } from "./tradingview_automation_logged"

/**
 * Registers the logged TradingView → Automation route.
 * This loader keeps the routing architecture modular and clean.
 */
export async function registerTradingViewLoggedAutomationLoader(app: FastifyInstance) {
  await app.register(registerTradingViewLoggedAutomationRoute)
}
