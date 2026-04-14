from app.ai.patching.region_patcher import region_patcher

async def handle_patch_region(payload: dict) -> dict:
    """
    Patch a specific region in a file based on a region hint + instruction.
    """
    file_path = payload.get("file_path")
    region_hint = payload.get("region_hint")
    instruction = payload.get("instruction")

    if not file_path or not region_hint or not instruction:
        return {"error": "Missing 'file_path', 'region_hint', or 'instruction' in payload"}

    result = await region_patcher.patch_region(file_path, region_hint, instruction)

    return {
        "command": "patch_region",
        "result": result,
    }
