from pydantic import BaseModel
from typing import Dict, Any

class ProjectSpec(BaseModel):
    project_name: str
    base_path: str | None = None
    metadata: Dict[str, Any] = {}
