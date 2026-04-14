// src/engines/micro/micro_system_finalizer.ts

import { computeStrategy, StrategyOutput } from "./micro_strategy_engine"
import { computeConfidence, ConfidenceOutput } from "./micro_confidence_engine"
import { computeDecision, DecisionOutput } from "./micro_decision_engine"
import { computeRouting, RoutingOutput } from "./micro_routing_engine"
import { computeWeighting, WeightingOutput } from "./micro_weighting_engine"
import { computeAggregation, AggregationOutput } from "./micro_aggregation_engine"
import { computeSummary, SummaryOutput } from "./micro_summary_engine"
import { computeMeta, MetaOutput } from "./micro_meta_engine"
import { computeMicroOutput, MicroOutput } from "./micro_output_engine"

export interface MicroSystemInputs {
  trend_strength: number
  risk_level: number
  volatility: number
  historical_success: number
  raw_signal: number
  signal_confidence: number
}

export interface MicroSystemOutput extends MicroOutput {}

export function runMicroSystem(inputs: MicroSystemInputs): MicroSystemOutput {
  const {
    trend_strength,
    risk_level,
    volatility,
    historical_success,
    raw_signal,
    signal_confidence
  } = inputs

  // 1. Strategy
  const strategy: StrategyOutput = computeStrategy({
    trend_strength,
    risk_level,
    volatility,
    historical_success,
    signal_confidence
  })

  // 2. Confidence
  const confidence: ConfidenceOutput = computeConfidence({
    data_quality: signal_confidence,
    model_agreement: 1 - volatility,
    historical_alignment: historical_success,
    volatility,
    signal_strength: raw_signal
  })

  // 3. Decision
  const decision: DecisionOutput = computeDecision({
    strategy,
    confidence,
    raw_signal,
    risk_level,
    volatility
  })

  // 4. Routing
  const routing: RoutingOutput = computeRouting({
    decision,
    strategy,
    confidence,
    risk_level,
    volatility
  })

  // 5. Weighting
  const weighting: WeightingOutput = computeWeighting({
    strategy,
    confidence,
    decision,
    raw_signal,
    risk_level,
    volatility
  })

  // 6. Aggregation
  const aggregation: AggregationOutput = computeAggregation({
    strategy,
    confidence,
    decision,
    routing,
    weighting
  })

  // 7. Summary
  const summary: SummaryOutput = computeSummary({
    strategy,
    confidence,
    decision,
    routing,
    weighting,
    aggregation
  })

  // 8. Meta Evaluation
  const meta: MetaOutput = computeMeta({
    strategy,
    confidence,
    decision,
    routing,
    weighting,
    aggregation
  })

  // 9. Final Micro Output
  const micro_output: MicroOutput = computeMicroOutput({
    strategy,
    confidence,
    decision,
    routing,
    weighting,
    aggregation,
    summary,
    meta
  })

  return micro_output
}
