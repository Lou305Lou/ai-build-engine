from app.ai.generators.code_generator import code_generator

async def handle_infer_paths(payload: dict) -> dict:
    """
    Infer file paths and map code blocks to them.
    """
    ai_text = payload.get("ai_text")
    if not ai_text:
        return {"error": "Missing 'ai_text' in payload"}

    result = code_generator.generate_file_map(ai_text)

    return {
        "command": "infer_paths",
        "result": result
    }
