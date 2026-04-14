// src/routes/tradingview_automation_logged_master_loader.ts

import { FastifyInstance } from "fastify"
import { registerTradingViewLoggedAutomationLoader } from "./tradingview_automation_logged_loader"

/**
 * Top-level loader for the logged TradingView Automation subsystem.
 * This ensures the logged automation pipeline is registered cleanly and consistently.
 */
export async function registerTradingViewLoggedAutomationMasterLoader(app: FastifyInstance) {
  await app.register(registerTradingViewLoggedAutomationLoader)
}
