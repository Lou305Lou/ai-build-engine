# engine/engine_registry.py

from engine.openrouter_client import OpenRouterClient

class EngineRegistry:
    """
    Holds multiple AI engines, each with its own model, key, and system prompt.
    """

    def __init__(self):
        self.engines = {}

    def register_engine(self, name, model, api_key=None, system_prompt=""):
        self.engines[name] = {
            "client": OpenRouterClient(api_key=api_key),
            "model": model,
            "system_prompt": system_prompt
        }

    def get(self, name):
        if name not in self.engines:
            raise ValueError(f"Engine '{name}' not found.")
        return self.engines[name]
