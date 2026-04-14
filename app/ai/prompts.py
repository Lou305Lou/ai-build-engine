def build_project_generation_prompt(payload: dict) -> str:
    project_name = payload.get("project_name", "Unnamed Project")
    stack = payload.get("stack", "fastapi")
    features = payload.get("features", [])
    modules = payload.get("modules", [])

    features_text = "\n".join(f"- {f}" for f in features)
    modules_text = "\n".join(f"- {m}" for m in modules)

    prompt = f"""
You are an AI code generation engine.

Generate a complete project scaffold with the following requirements:

Project name:
{project_name}

Tech stack:
{stack}

Key features:
{features_text or "- None specified"}

Core modules:
{modules_text or "- None specified"}

Respond in a structured, implementation-focused way, describing:
- Folder structure
- Key files
- Responsibilities of each major component
- Any important configuration notes

Do NOT write the full code yet; only describe the project layout and main components.
"""
    return prompt


def build_file_tree_prompt(design_text: str) -> str:
    """
    Prompt for converting a design description into a file tree.
    """
    return f"""
You are an AI file tree generator.

Convert the following project design into a structured file tree:

DESIGN:
{design_text}

Respond ONLY with a JSON object describing:
- root folder name
- nested folders
- file names
- empty files as ""
- files with content as strings

Do NOT include explanations.
"""
