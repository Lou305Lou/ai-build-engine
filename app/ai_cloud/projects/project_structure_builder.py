from typing import Dict, Any, List

def build_project_structure(spec: Dict[str, Any]) -> List[Dict[str, Any]]:
    project_name = spec.get("project_name", "untitled_project")
    base_path = spec.get("base_path", project_name)

    structure = [
        {"path": f"{base_path}/app/__init__.py", "content": ""},
        {"path": f"{base_path}/app/main.py", "content": "def main():\n    pass\n"},
        {"path": f"{base_path}/README.md", "content": f"# {project_name}\n"},
    ]

    return structure
