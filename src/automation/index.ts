// src/automation/index.ts

// Stage 1 — Input Normalizer
export * from "./tv_input_normalizer"

// Stage 2 — Signal Engine
export * from "./signal_engine"

// Stage 3 — Decision Engine
export * from "./decision_engine"

// Stage 4 — Risk Engine
export * from "./risk_engine"

// Stage 5 — Execution Plan Engine
export * from "./execution_engine"

// Stage 6 — Execution Validator
export * from "./execution_validator"

// Stage 7 — Order Engine
export * from "./order_engine"

// Stage 8 — Order Validator
export * from "./order_validator"

// Stage 9 — Order Router
export * from "./order_router"

// Stage 10 — Dispatch Engine
export * from "./order_dispatch_engine"

// Full Pipeline Orchestrator
export * from "./automation_orchestrator"
