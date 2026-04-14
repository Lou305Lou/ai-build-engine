from app.ai.generators.code_generator import code_generator
from app.ai.builders.file_plan_builder import file_plan_builder

async def handle_generate_file_plan(payload: dict) -> dict:
    """
    File-aware code generation:
    - Extract code blocks from AI text
    - Infer file paths
    - Build a nested file tree ready for writing
    """
    ai_text = payload.get("ai_text")
    if not ai_text:
        return {"error": "Missing 'ai_text' in payload"}

    file_map_result = code_generator.generate_file_map(ai_text)
    files = file_map_result.get("files", {})

    if not files:
        return {"error": "No files inferred from AI output", "detail": file_map_result}

    tree = file_plan_builder.build_from_file_map(files)

    return {
        "command": "generate_file_plan",
        "tree": tree,
        "meta": {
            "block_count": file_map_result.get("block_count", 0),
            "path_count": file_map_result.get("path_count", 0),
        },
    }
