from app.ai.assembly.project_assembler import project_assembler


async def handle_assemble_project(payload: dict) -> dict:
    """
    AI command: assemble_project
    - Executes the full one‑shot project assembly pipeline
    - Returns the assembler result object
    """
    result = await project_assembler.assemble(payload)

    return {
        "command": "assemble_project",
        "result": result,
    }
