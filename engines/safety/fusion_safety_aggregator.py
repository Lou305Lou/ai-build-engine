# Chunk 227 — Fusion Safety Aggregator
# Fully compliant with Luis' architecture rules:
# - Full file output
# - No diffs or partial edits
# - Deterministic, stateless, enterprise‑grade structure
# - Explicit constants, no magic numbers
# - Pure aggregation layer before Meta Layer

from typing import Dict, Any


class FusionSafetyAggregator:
    """
    Aggregates all safety signals into a final normalized safety verdict.
    This module consumes the formatted safety report from Chunk 226 and
    produces a single, deterministic safety score and label.
    """

    # Explicit weights (no magic numbers)
    WEIGHT_GLOBAL_CONF = 0.30
    WEIGHT_MICRO_CONF = 0.20
    WEIGHT_MACRO_CONF = 0.20
    WEIGHT_ALIGNMENT = 0.20
    WEIGHT_PENALTIES = 0.10

    VERSION = "1.0.0"

    def aggregate(self, safety_report: Dict[str, Any]) -> Dict[str, Any]:
        """
        Input:
            safety_report (dict) — output from Chunk 226

        Output:
            dict — final safety verdict with:
                - final_safety_score
                - final_safety_label
                - inputs_used
                - weights
                - version
        """

        global_conf = float(safety_report.get("global_confidence", 0.0))
        micro_conf = float(safety