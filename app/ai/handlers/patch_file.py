from app.ai.patching.file_patcher import file_patcher

async def handle_patch_file(payload: dict) -> dict:
    """
    Patch a single file based on an instruction.
    """
    file_path = payload.get("file_path")
    instruction = payload.get("instruction")

    if not file_path or not instruction:
        return {"error": "Missing 'file_path' or 'instruction' in payload"}

    result = await file_patcher.patch_file(file_path, instruction)

    return {
        "command": "patch_file",
        "result": result,
    }
