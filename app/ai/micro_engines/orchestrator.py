from pydantic import BaseModel
from typing import Dict, Any

from app.ai.micro_engines.confidence_engine import confidence_engine
from app.ai.micro_engines.validation_engine import validation_engine
from app.ai.micro_engines.safety_engine import safety_engine
from app.ai.micro_engines.coherence_engine import coherence_engine
from app.ai.micro_engines.relevance_engine import relevance_engine


class MicroEngineAggregateResult(BaseModel):
    confidence: Dict[str, Any]
    validation: Dict[str, Any]
    safety: Dict[str, Any]
    coherence: Dict[str, Any]
    relevance: Dict[str, Any]
    overall_score: float


class MicroEngineOrchestrator:
    """
    Orchestrates all micro-engines and aggregates their results.
    """

    async def evaluate(
        self,
        instruction: str,
        input_text: str,
        output_text: str,
    ) -> MicroEngineAggregateResult:
        # Run engines
        confidence = await confidence_engine.evaluate(input_text, output_text)
        validation = await validation_engine.validate(instruction, output_text)
        safety = await safety_engine.evaluate(output_text)
        coherence = await coherence_engine.evaluate(output_text)
        relevance = await relevance_engine.evaluate(instruction, output_text)

        # Overall score (simple average of key scores)
        overall_score = (
            confidence.score +
            validation.score +
            safety.score +
            coherence.score +
            relevance.score
        ) / 5.0

        return MicroEngineAggregateResult(
            confidence=confidence.model_dump(),
            validation=validation.model_dump(),
            safety=safety.model_dump(),
            coherence=coherence.model_dump(),
            relevance=relevance.model_dump(),
            overall_score=overall_score,
        )


micro_engine_orchestrator = MicroEngineOrchestrator()
