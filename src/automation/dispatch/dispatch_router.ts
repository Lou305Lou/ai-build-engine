// src/automation/dispatch/dispatch_router.ts

import {
  AutomationDispatchPackage,
  BrokerDispatchResult
} from "./broker_dispatch_adapter"
import { BrokerRegistry } from "./broker_registry"
import { BrokerDispatchEngine } from "./broker_dispatch_engine"

/**
 * Dispatch Router
 * Routes dispatch packages to the correct broker adapter.
 */
export class DispatchRouter {
  private registry: BrokerRegistry

  constructor(registry?: BrokerRegistry) {
    this.registry = registry ?? new BrokerRegistry()
  }

  /**
   * Routes the dispatch package to the correct broker.
   */
  async route(pkg: AutomationDispatchPackage): Promise<BrokerDispatchResult> {
    // Determine broker name from the automation pipeline
    const brokerName =
      pkg.finalOrder?.broker ??
      pkg.executionPlan?.broker ??
      "simulator" // fallback

    const adapter = this.registry.get(brokerName)
    const engine = new BrokerDispatchEngine(adapter)

    return engine.execute(pkg)
  }
}
