# Chunk 229 — Meta-Layer Execution Router
# Fully compliant with Luis' architecture rules:
# - Full file output
# - Deterministic, stateless logic
# - Explicit constants
# - No magic numbers
# - Pure routing layer after MetaSafetyGateway

from typing import Dict, Any


class MetaExecutionRouter:
    """
    Routes execution flow based on the MetaSafetyGateway decision.
    This module determines whether the system proceeds normally,
    downgrades output, or blocks execution entirely.
    """

    VERSION = "1.0.0"

    STATUS_ALLOW = "allow"
    STATUS_DOWNGRADE = "downgrade"
    STATUS_BLOCK = "block"

    ROUTE_FULL = "route_full_execution"
    ROUTE_RESTRICTED = "route_restricted_execution"
    ROUTE_BLOCKED = "route_blocked_execution"

    def route(self, gateway_report: Dict[str, Any]) -> Dict[str, Any]:
        """
        Input:
            gateway_report (dict) — output from MetaSafetyGateway (Chunk 228)

        Output:
            dict — routing decision:
                - route
                - gateway_status
                - final_safety_score
                - final_safety_label
                - version
        """

        status = gateway_report.get("gateway_status", self.STATUS_BLOCK)
        score = float(gateway_report.get("final_safety_score", 0.0))
        label = gateway_report.get("final_safety_label", "unknown")

        if status == self.STATUS_ALLOW:
            route = self.ROUTE_FULL
        elif status == self.STATUS_DOWNGRADE:
            route = self.ROUTE_RESTRICTED
        else:
            route = self.ROUTE_BLOCKED

        return {
            "route": route,
            "gateway_status": status,
            "final_safety_score": score,
            "final_safety_label": label,
            "version": self.VERSION
        }
