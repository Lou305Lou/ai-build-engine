from pydantic import BaseModel
from typing import Dict, Any

class AICloudCommandRequest(BaseModel):
    command: str
    payload: Dict[str, Any] = {}

