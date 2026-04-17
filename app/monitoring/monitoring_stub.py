class MonitoringStub:
    def record(self, metric: str, value: float):
        return {
            "metric": metric,
            "value": value,
            "recorded": True
        }

monitoring_stub = MonitoringStub()
