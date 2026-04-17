from app.ai.generators.code_generator import code_generator


async def handle_generate_code_files(payload: dict) -> dict:
    """
    AI command: generate_code_files
    - Extracts code blocks from AI text
    - Maps blocks to real file paths
    - Returns a complete file map
    """
    ai_text = payload.get("ai_text")
    if not ai_text:
        return {"error": "Missing 'ai_text' in payload"}

    blocks = code_generator.extract_code_blocks(ai_text)
    file_map = code_generator.map_blocks_to_files(blocks)

    return {
        "command": "generate_code_files",
        "files": file_map,
        "count": len(file_map),
    }
