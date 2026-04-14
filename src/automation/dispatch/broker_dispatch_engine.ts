// src/automation/dispatch/broker_dispatch_engine.ts

import {
  AutomationDispatchPackage,
  BrokerDispatchAdapter,
  BrokerDispatchResult
} from "./broker_dispatch_adapter"

/**
 * Core engine responsible for executing dispatch packages
 * using a provided broker adapter.
 */
export class BrokerDispatchEngine {
  private adapter: BrokerDispatchAdapter

  constructor(adapter: BrokerDispatchAdapter) {
    this.adapter = adapter
  }

  /**
   * Executes the dispatch package on the selected broker.
   */
  async execute(pkg: AutomationDispatchPackage): Promise<BrokerDispatchResult> {
    try {
      const result = await this.adapter.executeDispatch(pkg)

      return {
        ...result,
        broker: this.adapter.getName(),
        timestamp: Date.now()
      }
    } catch (err: any) {
      return {
        success: false,
        broker: this.adapter.getName(),
        error: err?.message ?? "Unknown dispatch error",
        timestamp: Date.now()
      }
    }
  }
}
