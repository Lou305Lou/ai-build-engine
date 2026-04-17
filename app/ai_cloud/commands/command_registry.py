from typing import Dict, Callable, Any

command_registry: Dict[str, Callable[[Dict[str, Any]], Any]] = {}
