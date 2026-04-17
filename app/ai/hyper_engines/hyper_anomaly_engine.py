from pydantic import BaseModel
from typing import Dict, Any

class HyperAnomalyResult(BaseModel):
    anomaly_score: float
    label: str
    reasoning: str
    hyper_layer: Dict[str, Any]

class HyperAnomalyEngine:
    async def evaluate(self, hyper_results: Dict[str, Any]) -> HyperAnomalyResult:
        anomaly_hits = 0

        for k, v in hyper_results.items():
            if "drift_score" in v and v["drift_score"] > 0.7:
                anomaly_hits += 1
            if "contradiction_score" in v and v["contradiction_score"] > 0.7:
                anomaly_hits += 1
            if "stability_score" in v and v["stability_score"] < 0.3:
                anomaly_hits += 1

        anomaly_score = min(1.0, anomaly_hits * 0.1)

        label = "low-anomaly" if anomaly_score <= 0.3 else "high-anomaly"

        reasoning = f"anomaly_hits={anomaly_hits}, score={anomaly_score:.2f}"

        return HyperAnomalyResult(
            anomaly_score=anomaly_score,
            label=label,
            reasoning=reasoning,
            hyper_layer=hyper_results
        )

hyper_anomaly_engine = HyperAnomalyEngine()
