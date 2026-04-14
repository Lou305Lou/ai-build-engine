# Chunk 233 — Engine Integration Layer
# Fully compliant with Luis' architecture rules:
# - Full file output
# - Deterministic, modular integration
# - Connects FastAPI → Model Connector → Engine (Chunks 1–230)
# - Structured envelopes
# - No magic numbers

from typing import Dict, Any, Optional

from api.model_connector import ModelConnector

from engines.safety.safety_fusion_aggregator import FusionSafetyAggregator
from engines.meta.meta_safety_gateway import MetaSafetyGateway
from engines.meta.meta_execution_router import MetaExecutionRouter
from engines.meta.meta_output_governor import MetaOutputGovernor


class EngineIntegration:
    """
    Integrates the model connector with the full engine pipeline.
    """

    VERSION = "1.0.0"

    def __init__(self, logger: Optional[Any] = None, tracer: Optional[Any] = None, metrics: Optional[Any] = None):
        self.logger = logger
        self.tracer = tracer
        self.metrics = metrics

        self.model_connector = ModelConnector(logger=logger, tracer=tracer)

        self.safety_fusion = FusionSafetyAggregator()
        self.meta_gateway = MetaSafetyGateway()
        self.meta_router = MetaExecutionRouter()
        self.meta_governor = MetaOutputGovernor(logger=logger, tracer=tracer, metrics=metrics)

    def _trace(self, label: str, payload: Dict[str, Any]) -> None:
        if self.tracer:
            self.tracer.trace(label, payload)

    async def run(self, prompt: str) -> Dict[str, Any]:
        """
        Executes the full engine pipeline:
            1. Model call
            2. Safety fusion
            3. Meta gateway
            4. Meta router
            5. Output governor
        """

        self._trace("engine_integration_entry", {"prompt_length": len(prompt)})

        model_output = await self.model_connector.complete(prompt)

        safety_report = self.safety_fusion.aggregate(model_output)

        gateway_report = self.meta_gateway.evaluate(safety_report)

        routing_report = self.meta_router.route(gateway_report)

        governed_output = self.meta_governor.govern(
            routing_report=routing_report,
            model_output=model_output
        )

        self._trace("engine_integration_exit", {
            "policy": governed_output.get("policy"),
            "score": governed_output.get("final_safety_score")
        })

        return {
            "error": False,
            "engine_output": governed_output,
            "version": self.VERSION
        }
