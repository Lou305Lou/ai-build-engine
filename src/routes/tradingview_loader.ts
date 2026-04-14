// src/routes/tradingview_loader.ts

import { FastifyInstance } from "fastify"

// Master TradingView route aggregator
import { registerTradingViewMasterRoutes } from "./tradingview_master_routes"

// Individual TradingView route modules (for completeness and future extension)
import { registerTradingViewRoutes } from "./tradingview_routes"
import { registerTradingViewFusionBridge } from "./tradingview_fusion_bridge"
import { registerTradingViewFusionSystemBridge } from "./tradingview_fusion_system_bridge"
import { registerTradingViewFusionSystemGlobal } from "./tradingview_fusion_system_global"
import { registerTradingViewFullPipeline } from "./tradingview_full_pipeline"
import { registerTradingViewMasterPipeline } from "./tradingview_master_pipeline"
import { registerTradingViewUnifiedOutput } from "./tradingview_unified_output"

export async function registerTradingViewLoader(app: FastifyInstance) {
  // Register the master route bundle first
  await app.register(registerTradingViewMasterRoutes)

  // Register individual modules (ensures modularity + future extensibility)
  await app.register(registerTradingViewRoutes)
  await app.register(registerTradingViewFusionBridge)
  await app.register(registerTradingViewFusionSystemBridge)
  await app.register(registerTradingViewFusionSystemGlobal)
  await app.register(registerTradingViewFullPipeline)
  await app.register(registerTradingViewMasterPipeline)
  await app.register(registerTradingViewUnifiedOutput)
}
