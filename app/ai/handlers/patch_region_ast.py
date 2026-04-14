from app.ai.patching.ast_region_patcher import ast_region_patcher

async def handle_patch_region_ast(payload: dict) -> dict:
    """
    AST-aware region patching for Python files.

    Expected payload:
      {
        "file_path": "app/api/routes/user.py",
        "region_type": "function" | "class" | "method",
        "name": "get_user",
        "class_name": "UserService",  # only for methods
        "instruction": "Add logging at the start of the function"
      }
    """
    file_path = payload.get("file_path")
    region_type = payload.get("region_type")
    name = payload.get("name")
    class_name = payload.get("class_name")
    instruction = payload.get("instruction")

    if not file_path or not region_type or not name or not instruction:
        return {
            "error": "Missing 'file_path', 'region_type', 'name', or 'instruction' in payload",
            "payload": payload,
        }

    result = await ast_region_patcher.patch_region(
        file_path=file_path,
        region_type=region_type,
        name=name,
        instruction=instruction,
        class_name=class_name,
    )

    return {
        "command": "patch_region_ast",
        "result": result,
    }
