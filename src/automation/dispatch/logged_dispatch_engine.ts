// src/automation/dispatch/logged_dispatch_engine.ts

import {
  AutomationDispatchPackage,
  BrokerDispatchResult
} from "./broker_dispatch_adapter"
import { BrokerRegistry } from "./broker_registry"
import { BrokerDispatchEngine } from "./broker_dispatch_engine"
import { AutomationPipelineLogger } from "../logs/pipeline_logger"

/**
 * Logged Dispatch Engine
 * Wraps the dispatch router + engine with full structured logging.
 */
export class LoggedDispatchEngine {
  private registry: BrokerRegistry
  private logger: AutomationPipelineLogger

  constructor(
    registry?: BrokerRegistry,
    logger?: AutomationPipelineLogger
  ) {
    this.registry = registry ?? new BrokerRegistry()
    this.logger = logger ?? new AutomationPipelineLogger()
  }

  /**
   * Executes a dispatch package with full logging.
   */
  async execute(pkg: AutomationDispatchPackage): Promise<BrokerDispatchResult> {
    const brokerName =
      pkg.finalOrder?.broker ??
      pkg.executionPlan?.broker ??
      "simulator"

    this.logger.dispatch("Dispatch attempt started", {
      broker: brokerName,
      pkg
    })

    try {
      const adapter = this.registry.get(brokerName)
      const engine = new BrokerDispatchEngine(adapter)

      const result = await engine.execute(pkg)

      this.logger.dispatch("Dispatch completed", {
        broker: brokerName,
        result
      })

      return result
    } catch (err: any) {
      this.logger.error("Dispatch failed", {
        broker: brokerName,
        error: err?.message ?? "Unknown dispatch error",
        stack: err?.stack
      })

      return {
        success: false,
        broker: brokerName,
        error: err?.message ?? "Unknown dispatch error",
        timestamp: Date.now()
      }
    }
  }
}
