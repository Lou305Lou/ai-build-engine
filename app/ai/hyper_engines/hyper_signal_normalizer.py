from pydantic import BaseModel
from typing import Dict, Any

class HyperSignalNormalizerResult(BaseModel):
    normalized: Dict[str, float]
    reasoning: str

class HyperSignalNormalizer:
    async def normalize(self, hyper_results: Dict[str, Any]) -> HyperSignalNormalizerResult:
        normalized = {}

        for k, v in hyper_results.items():
            if "stability_score" in v:
                normalized[k] = v["stability_score"]
            elif "drift_score" in v:
                normalized[k] = 1.0 - v["drift_score"]
            elif "contradiction_score" in v:
                normalized[k] = 1.0 - v["contradiction_score"]

        reasoning = ", ".join([f"{k}={v:.2f}" for k, v in normalized.items()])

        return HyperSignalNormalizerResult(
            normalized=normalized,
            reasoning=reasoning
        )

hyper_signal_normalizer = HyperSignalNormalizer()
