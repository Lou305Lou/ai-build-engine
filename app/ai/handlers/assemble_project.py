from app.ai.assembly.project_assembler import project_assembler

async def handle_assemble_project(payload: dict) -> dict:
    """
    One-shot project generation pipeline.
    """
    result = await project_assembler.assemble(payload)
    return {
        "command": "assemble_project",
        "result": result
    }
