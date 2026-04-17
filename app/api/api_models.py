from pydantic import BaseModel
from typing import Any, Dict

class APIResponse(BaseModel):
    status: str
    data: Dict[str, Any]
