from typing import Callable, Dict, Any
from app.ai_cloud.commands.command_registry import command_registry

def register_command(name: str):
    def decorator(func: Callable[[Dict[str, Any]], Any]):
        command_registry[name] = func
        return func
    return decorator
