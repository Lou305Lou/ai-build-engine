from pydantic import BaseModel
from typing import Dict, Any

class HyperAnomalyAggregateResult(BaseModel):
    anomaly_scores: Dict[str, Any]
    final_anomaly: float
    label: str

class HyperAnomalyAggregator:
    async def aggregate(self, anomaly_results: Dict[str, Any]) -> HyperAnomalyAggregateResult:
        scores = [v["anomaly_score"] for v in anomaly_results.values() if "anomaly_score" in v]

        final_anomaly = sum(scores) / max(len(scores), 1)
        final_anomaly = max(0.0, min(1.0, final_anomaly))

        if final_anomaly <= 0.25:
            label = "low-anomaly"
        elif final_anomaly <= 0.50:
            label = "moderate-anomaly"
        else:
            label = "high-anomaly"

        return HyperAnomalyAggregateResult(
            anomaly_scores=anomaly_results,
            final_anomaly=final_anomaly,
            label=label
        )

hyper_anomaly_aggregator = HyperAnomalyAggregator()
