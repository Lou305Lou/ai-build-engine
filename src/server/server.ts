// src/server/server.ts

import Fastify from "fastify"
import cors from "@fastify/cors"

// API engines
import { registerFusionAPIExtensions } from "../api/fusion_api_extensions"
import { registerSystemAPIEngine } from "../api/system_api_engine"

// Route integrations
import { registerFusionRoutes } from "../routes/fusion_routes"

export async function buildServer() {
  const app = Fastify({
    logger: true,
    trustProxy: true,
    bodyLimit: 5 * 1024 * 1024 // 5MB
  })

  // CORS
  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST"]
  })

  // Health route
  app.get("/health", async () => {
    return { status: "ok", timestamp: Date.now() }
  })

  // Register API engines
  await app.register(registerFusionAPIExtensions)
  await app.register(registerSystemAPIEngine)

  // Register Fusion routes (Chunk 177)
  await app.register(registerFusionRoutes)

  return app
}

// Standalone start
if (require.main === module) {
  buildServer()
    .then(app => {
      const port = process.env.PORT ? Number(process.env.PORT) : 3000
      app.listen({ port, host: "0.0.0.0" })
      console.log(`Server running on port ${port}`)
    })
    .catch(err => {
      console.error("Failed to start server:", err)
      process.exit(1)
    })
}

