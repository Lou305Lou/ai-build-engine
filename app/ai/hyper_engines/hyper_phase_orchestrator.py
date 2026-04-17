from typing import Dict, Any
from pydantic import BaseModel

from app.ai.hyper_engines.hyper_layer_collector import hyper_layer_collector
from app.ai.hyper_engines.hyper_master_aggregator import hyper_master_aggregator
from app.ai.hyper_engines.hyper_master_finalizer import hyper_master_finalizer
from app.ai.hyper_engines.hyper_system_report_engine import hyper_system_report_engine

class HyperPhaseOrchestratorResult(BaseModel):
    final_score: float
    label: str
    summary: str
    full_report: Dict[str, Any]

class HyperPhaseOrchestrator:
    async def run(self, **hyper_layers: Dict[str, Any]) -> HyperPhaseOrchestratorResult:
        collected = await hyper_layer_collector.collect(**hyper_layers)
        master = await hyper_master_aggregator.aggregate(collected.collected)
        finalized = await hyper_master_finalizer.finalize(master.dict())
        report = await hyper_system_report_engine.generate(finalized.dict())

        return HyperPhaseOrchestratorResult(
            final_score=finalized.final_score,
            label=finalized.label,
            summary=report.summary,
            full_report=report.report
        )

hyper_phase_orchestrator = HyperPhaseOrchestrator()
