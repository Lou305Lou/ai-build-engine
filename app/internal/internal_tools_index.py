from app.metrics.metrics_core import metrics_core
from app.diagnostics.diagnostics_aggregator import aggregate_diagnostics

def internal_tools():
    return {
        "metrics": metrics_core.collect(),
        "diagnostics": aggregate_diagnostics()
    }
