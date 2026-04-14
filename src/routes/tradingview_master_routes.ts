// src/routes/tradingview_master_routes.ts

import { FastifyInstance } from "fastify"

// Import all TradingView pipeline routes
import { registerTradingViewRoutes } from "./tradingview_routes"
import { registerTradingViewFusionBridge } from "./tradingview_fusion_bridge"
import { registerTradingViewFusionSystemBridge } from "./tradingview_fusion_system_bridge"
import { registerTradingViewFusionSystemGlobal } from "./tradingview_fusion_system_global"
import { registerTradingViewFullPipeline } from "./tradingview_full_pipeline"
import { registerTradingViewMasterPipeline } from "./tradingview_master_pipeline"
import { registerTradingViewUnifiedOutput } from "./tradingview_unified_output"

export async function registerTradingViewMasterRoutes(app: FastifyInstance) {
  // Base TradingView webhook intake
  await app.register(registerTradingViewRoutes)

  // TradingView → Fusion
  await app.register(registerTradingViewFusionBridge)

  // TradingView → Fusion → System
  await app.register(registerTradingViewFusionSystemBridge)

  // TradingView → Fusion → System → Global
  await app.register(registerTradingViewFusionSystemGlobal)

  // TradingView → Fusion → System → Global → Meta
  await app.register(registerTradingViewFullPipeline)

  // TradingView → Fusion → System → Global → Meta → Final Output
  await app.register(registerTradingViewMasterPipeline)

  // Unified output endpoint
  await app.register(registerTradingViewUnifiedOutput)
}
