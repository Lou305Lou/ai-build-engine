from typing import Dict, Any

class AICloudCommandEngine:
    def __init__(self):
        # Register all supported commands here
        self.handlers = {
            "health": self.handle_health,
        }

    async def execute(self, command: str, payload: Dict[str, Any]):
        # Look up handler
        handler = self.handlers.get(command)

        # Unknown command
        if handler is None:
            return {
                "error": f"Unknown command: {command}",
                "available_commands": list(self.handlers.keys())
            }

        # Execute handler
        return await handler(payload)

    async def handle_health(self, payload: Dict[str, Any]):
        return {
            "status": "ok",
            "engine": "AI Cloud Command Engine",
            "payload_received": payload
        }

# Singleton instance
ai_cloud_command_engine = AICloudCommandEngine()
