from app.ai.writers.file_writer import file_writer

async def handle_write_file_tree(payload: dict) -> dict:
    """
    Write a file tree to disk.
    """
    tree = payload.get("tree")
    if not tree:
        return {"error": "Missing 'tree' in payload"}

    result = file_writer.write_tree(tree)

    return {
        "command": "write_file_tree",
        "result": result
    }
