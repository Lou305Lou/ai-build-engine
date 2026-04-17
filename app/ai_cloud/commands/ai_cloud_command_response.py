from pydantic import BaseModel
from typing import Dict, Any

class AICloudCommandResponse(BaseModel):
    status: str
    data: Dict[str, Any]
