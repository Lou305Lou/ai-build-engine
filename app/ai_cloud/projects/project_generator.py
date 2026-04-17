from typing import Dict, Any
from app.ai_cloud.projects.project_structure_builder import build_project_structure
from app.ai_cloud.projects.project_file_writer import write_project_files

class ProjectGenerator:
    async def generate(self, spec: Dict[str, Any]) -> Dict[str, Any]:
        structure = build_project_structure(spec)
        files = await write_project_files(structure)
        return {
            "status": "project_generated",
            "structure": structure,
            "files": files,
        }

project_generator = ProjectGenerator()
