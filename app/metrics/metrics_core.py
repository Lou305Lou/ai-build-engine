class MetricsCore:
    def collect(self):
        return {
            "metrics": {
                "requests": 0,
                "errors": 0
            }
        }

metrics_core = MetricsCore()
