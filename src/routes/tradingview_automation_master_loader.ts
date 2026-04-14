// src/routes/tradingview_automation_master_loader.ts

import { FastifyInstance } from "fastify"
import { registerTradingViewAutomationLoader } from "./tradingview_automation_loader"

/**
 * Top-level loader for the entire TradingView Automation subsystem.
 * This ensures the automation pipeline is registered cleanly and consistently.
 */
export async function registerTradingViewAutomationMasterLoader(app: FastifyInstance) {
  // Register the TradingView → Automation pipeline route
  await app.register(registerTradingViewAutomationLoader)
}
