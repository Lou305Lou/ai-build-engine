class TelemetryLogger:
    def record(self, event: str, data: dict):
        return {
            "event": event,
            "data": data,
            "recorded": True
        }

telemetry_logger = TelemetryLogger()
