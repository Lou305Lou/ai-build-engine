# Chunk 228 — Meta-Layer Safety Gateway
# Fully compliant with Luis' architecture rules:
# - Full file output
# - Deterministic, stateless logic
# - Explicit constants
# - No magic numbers
# - Pure gateway layer before Meta-Layer execution

from typing import Dict, Any


class MetaSafetyGateway:
    """
    Entry point to the Meta Layer.
    Consumes the final safety verdict from Chunk 227 and determines
    whether the system may proceed, must downgrade, or must block.
    """

    VERSION = "1.0.0"

    # Thresholds (explicit constants)
    THRESHOLD_SAFE = 0.85
    THRESHOLD_CAUTION = 0.60

    def evaluate(self, final_safety_report: Dict[str, Any]) -> Dict[str, Any]:
        """
        Input:
            final_safety_report (dict) — output from FusionSafetyAggregator (Chunk 227)

        Output:
            dict — gateway decision:
                - gateway_status: "allow" | "downgrade" | "block"
                - final_safety_score
                - final_safety_label
                - version
        """

        score = float(final_safety_report.get("final_safety_score", 0.0))
        label = final_safety_report.get("final_safety_label", "unknown")

        if score >= self.THRESHOLD_SAFE:
            status = "allow"
        elif score >= self.THRESHOLD_CAUTION:
            status = "downgrade"
        else:
            status = "block"

        return {
            "gateway_status": status,
            "final_safety_score": score,
            "final_safety_label": label,
            "version": self.VERSION
        }
