# Chunk 230 — Meta-Layer Output Governor (Option C — Enhanced)
# Fully compliant with Luis' architecture rules:
# - Full file output
# - Deterministic, stateless logic
# - Explicit constants
# - Logging hooks
# - Tracing hooks
# - Metrics counters
# - Policy override injection
# - Structured envelopes
# - Final output control layer after MetaExecutionRouter

from typing import Dict, Any, Optional


class MetaOutputGovernor:
    """
    Final output control layer.
    Applies output policy based on the routing decision from Chunk 229.
    Includes instrumentation hooks for logging, tracing, and metrics.
    """

    VERSION = "1.1.0"

    ROUTE_FULL = "route_full_execution"
    ROUTE_RESTRICTED = "route_restricted_execution"
    ROUTE_BLOCKED = "route_blocked_execution"

    POLICY_FULL = "full_output"
    POLICY_RESTRICTED = "restricted_output"
    POLICY_BLOCKED = "blocked_output"

    # Deterministic downgrade template
    DOWNGRADE_TEMPLATE = {
        "message": "Output downgraded due to safety conditions.",
        "reason": "Safety threshold not met.",
        "partial": None
    }

    # Block template
    BLOCK_TEMPLATE = {
        "message": "Execution blocked due to safety conditions.",
        "reason": "Safety threshold violated."
    }

    def __init__(self, logger: Optional[Any] = None, tracer: Optional[Any] = None, metrics: Optional[Any] = None):
        """
        Optional instrumentation injection:
            logger  — must support .info() and .error()
            tracer  — must support .trace()
            metrics — must support .increment(metric_name)
        """
        self.logger = logger
        self.tracer = tracer
        self.metrics = metrics

    def _log(self, message: str) -> None:
        if self.logger:
            self.logger.info(message)

    def _trace(self, label: str, payload: Dict[str, Any]) -> None:
        if self.tracer:
            self.tracer.trace(label, payload)

    def _metric(self, name: str) -> None:
        if self.metrics:
            self.metrics.increment(name)

    def govern(
        self,
        routing_report: Dict[str, Any],
        model_output: Dict[str, Any],
        policy_override: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Input:
            routing_report (dict) — output from MetaExecutionRouter (Chunk 229)
            model_output (dict) — raw output from the model or execution engine
            policy_override (str | None) — optional forced policy:
                "full_output" | "restricted_output" | "blocked_output"

        Output:
            dict — governed output:
                - policy
                - content
                - final_safety_score
                - final_safety_label
                - version
        """

        route = routing_report.get("route", self.ROUTE_BLOCKED)
        score = float(routing_report.get("final_safety_score", 0.0))
        label = routing_report.get("final_safety_label", "unknown")

        # Instrumentation: trace entry
        self._trace("meta_output_governor_entry", {
            "route": route,
            "score": score,
            "label": label,
            "override": policy_override
        })

        # Apply override if present
        if policy_override in {self.POLICY_FULL, self.POLICY_RESTRICTED, self.POLICY_BLOCKED}:
            policy = policy_override
            self._log(f"Policy override applied: {policy}")
            self._metric("policy_override_used")
        else:
            # Normal routing
            if route == self.ROUTE_FULL:
                policy = self.POLICY_FULL
            elif route == self.ROUTE_RESTRICTED:
                policy = self.POLICY_RESTRICTED
            else:
                policy = self.POLICY_BLOCKED

        # Apply policy
        if policy == self.POLICY_FULL:
            content = model_output
            self._metric("policy_full")
        elif policy == self.POLICY_RESTRICTED:
            downgraded = dict(self.DOWNGRADE_TEMPLATE)
            downgraded["partial"] = model_output.get("summary")
            content = downgraded
            self._metric("policy_restricted")
        else:
            content = dict(self.BLOCK_TEMPLATE)
            self._metric("policy_blocked")

        # Instrumentation: trace exit
        self._trace("meta_output_governor_exit", {
            "policy": policy,
            "score": score,
            "label": label
        })

        return {
            "policy": policy,
            "content": content,
            "final_safety_score": score,
            "final_safety_label": label,
            "version": self.VERSION
        }
