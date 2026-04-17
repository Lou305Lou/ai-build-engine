class MetricsCollector:
    def record(self, name: str, value: float):
        return {
            "metric": name,
            "value": value,
            "recorded": True
        }

metrics_collector = MetricsCollector()
