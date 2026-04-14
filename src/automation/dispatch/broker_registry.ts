// src/automation/dispatch/broker_registry.ts

import {
  BrokerDispatchAdapter
} from "./broker_dispatch_adapter"
import { SimulatorDispatchAdapter } from "./simulator_dispatch_adapter"

/**
 * Registry that stores all broker dispatch adapters.
 * Provides a clean API for retrieving adapters by name.
 */
export class BrokerRegistry {
  private adapters: Map<string, BrokerDispatchAdapter> = new Map()
  private defaultAdapter: BrokerDispatchAdapter

  constructor() {
    // Default fallback is the simulator
    this.defaultAdapter = new SimulatorDispatchAdapter()

    // Register simulator by default
    this.register(this.defaultAdapter)
  }

  /**
   * Registers a broker adapter.
   */
  register(adapter: BrokerDispatchAdapter) {
    this.adapters.set(adapter.getName(), adapter)
  }

  /**
   * Retrieves a broker adapter by name.
   * Falls back to the simulator if not found.
   */
  get(name: string): BrokerDispatchAdapter {
    return this.adapters.get(name) ?? this.defaultAdapter
  }

  /**
   * Returns all registered broker names.
   */
  list(): string[] {
    return Array.from(this.adapters.keys())
  }
}
