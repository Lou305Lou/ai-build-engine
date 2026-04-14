// src/automation/dispatch/simulator_dispatch_adapter.ts

import {
  AutomationDispatchPackage,
  BrokerDispatchAdapter,
  BrokerDispatchResult
} from "./broker_dispatch_adapter"

/**
 * A zero-risk simulated broker adapter.
 * Instantly "fills" orders and returns a normalized result.
 */
export class SimulatorDispatchAdapter implements BrokerDispatchAdapter {
  getName(): string {
    return "simulator"
  }

  async executeDispatch(pkg: AutomationDispatchPackage): Promise<BrokerDispatchResult> {
    const fakeOrderId = `SIM-${Date.now()}-${Math.floor(Math.random() * 999999)}`

    return {
      success: true,
      broker: this.getName(),
      orderId: fakeOrderId,
      filledQty: pkg.quantity,
      status: "filled",
      raw: {
        simulated: true,
        received: pkg
      },
      timestamp: Date.now()
    }
  }
}
