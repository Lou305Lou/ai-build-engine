from typing import Dict, Any
from app.ai_cloud.commands.register_command import register_command
from app.ai_cloud.projects.project_generator import project_generator

@register_command("generate_project")
async def generate_project_command(payload: Dict[str, Any]):
    spec = {
        "project_name": payload.get("project_name", "untitled_project"),
        "base_path": payload.get("base_path", payload.get("project_name", "untitled_project")),
        "metadata": payload.get("metadata", {}),
    }

    result = await project_generator.generate(spec)

    return result
