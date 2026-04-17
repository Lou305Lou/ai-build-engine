from typing import Dict, Any
from pydantic import BaseModel

class HyperLayerCollectorResult(BaseModel):
    collected: Dict[str, Any]
    reasoning: str

class HyperLayerCollector:
    async def collect(self, **layers: Dict[str, Any]) -> HyperLayerCollectorResult:
        collected = {k: v for k, v in layers.items()}
        reasoning = f"{len(collected)} hyper layers collected"
        return HyperLayerCollectorResult(collected=collected, reasoning=reasoning)

hyper_layer_collector = HyperLayerCollector()
