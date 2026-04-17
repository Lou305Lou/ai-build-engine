from pydantic import BaseModel
from typing import Dict, Any

class HyperAnomalyFinalResult(BaseModel):
    final_anomaly: float
    label: str
    reasoning: str
    anomaly_signals: Dict[str, Any]

class HyperAnomalyFinalizer:
    async def finalize(self, anomaly_results: Dict[str, Any]) -> HyperAnomalyFinalResult:
        scores = [v["anomaly_score"] for v in anomaly_results.values() if "anomaly_score" in v]
        final_anomaly = sum(scores) / max(len(scores), 1)
        final_anomaly = max(0.0, min(1.0, final_anomaly))

        if final_anomaly <= 0.25:
            label = "low-anomaly"
        elif final_anomaly <= 0.50:
            label = "moderate-anomaly"
        else:
            label = "high-anomaly"

        reasoning = ", ".join([f"{k}={v['anomaly_score']:.2f}" for k, v in anomaly_results.items()])

        return HyperAnomalyFinalResult(
            final_anomaly=final_anomaly,
            label=label,
            reasoning=reasoning,
            anomaly_signals=anomaly_results
        )

hyper_anomaly_finalizer = HyperAnomalyFinalizer()
