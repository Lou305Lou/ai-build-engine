// src/automation/dispatch/broker_dispatch_adapter.ts

/**
 * The normalized dispatch package produced by the automation pipeline.
 * This is the exact structure the broker adapters must consume.
 */
export interface AutomationDispatchPackage {
  symbol: string
  side: "buy" | "sell"
  quantity: number
  orderType: "market" | "limit"
  limitPrice?: number
  timestamp: number

  // Metadata from the automation pipeline
  signal: any
  decision: any
  risk: any
  executionPlan: any
  finalOrder: any
}

/**
 * The response returned by a broker adapter after attempting execution.
 */
export interface BrokerDispatchResult {
  success: boolean
  broker: string
  orderId?: string
  filledQty?: number
  status?: string
  raw?: any
  error?: string
  timestamp: number
}

/**
 * Interface that all broker dispatch adapters must implement.
 * This ensures the dispatch engine can route orders to any broker.
 */
export interface BrokerDispatchAdapter {
  /**
   * Returns the name of the broker (e.g., "alpaca", "binance", "simulator").
   */
  getName(): string

  /**
   * Executes the dispatch package on the broker.
   */
  executeDispatch(pkg: AutomationDispatchPackage): Promise<BrokerDispatchResult>
}
