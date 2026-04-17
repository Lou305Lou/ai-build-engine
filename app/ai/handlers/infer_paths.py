from app.ai.generators.code_generator import code_generator


async def handle_infer_paths(payload: dict) -> dict:
    """
    AI command: infer_paths
    - Infers real file paths from AI text
    - Generates a complete file map
    """
    ai_text = payload.get("ai_text")
    if not ai_text:
        return {"error": "Missing 'ai_text' in payload"}

    result = code_generator.generate_file_map(ai_text)

    return {
        "command": "infer_paths",
        "result": result,
    }
