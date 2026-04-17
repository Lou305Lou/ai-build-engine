from pydantic import BaseModel
from typing import Dict, Any

class HyperSignalIntegratorResult(BaseModel):
    integrated: Dict[str, float]
    reasoning: str

class HyperSignalIntegrator:
    async def integrate(self, normalized: Dict[str, float]) -> HyperSignalIntegratorResult:
        integrated = {}

        for k, v in normalized.items():
            integrated[k] = max(0.0, min(1.0, v))

        reasoning = ", ".join([f"{k}={v:.2f}" for k, v in integrated.items()])

        return HyperSignalIntegratorResult(
            integrated=integrated,
            reasoning=reasoning
        )

hyper_signal_integrator = HyperSignalIntegrator()
