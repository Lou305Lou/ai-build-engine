import json
import time
from typing import Optional, Dict, Any

class EventBuilder:
    """
    Builds structured SSE events for dashboards and terminals.
    """

    def build(
        self,
        event_type: str,
        message: str,
        stage: str = "",
        percent: Optional[int] = None,
        data: Optional[Dict[str, Any]] = None,
        level: str = "info",
    ) -> str:
        payload = {
            "type": event_type,
            "message": message,
            "stage": stage,
            "timestamp": int(time.time()),
            "level": level,  # info | warning | error
        }

        if percent is not None:
            payload["percent"] = percent

        if data is not None:
            payload["data"] = data

        return f"event: {event_type}\ndata: {json.dumps(payload)}\n\n"

    def info(self, event_type: str, message: str, stage: str = "", percent: Optional[int] = None, data: Optional[Dict[str, Any]] = None) -> str:
        return self.build(event_type, message, stage=stage, percent=percent, data=data, level="info")

    def warning(self, event_type: str, message: str, stage: str = "", percent: Optional[int] = None, data: Optional[Dict[str, Any]] = None) -> str:
        return self.build(event_type, message, stage=stage, percent=percent, data=data, level="warning")

    def error(self, event_type: str, message: str, stage: str = "", percent: Optional[int] = None, data: Optional[Dict[str, Any]] = None) -> str:
        return self.build(event_type, message, stage=stage, percent=percent, data=data, level="error")


# Global instance
event_builder = EventBuilder()
