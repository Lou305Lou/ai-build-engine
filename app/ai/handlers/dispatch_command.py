from app.ai.handlers.generate_file_tree import handle_generate_file_tree
from app.ai.handlers.write_file_tree import handle_write_file_tree
from app.ai.handlers.undo_last_write import handle_undo_last_write
from app.ai.handlers.generate_code_files import handle_generate_code_files
from app.ai.handlers.infer_paths import handle_infer_paths
from app.ai.handlers.assemble_project import handle_assemble_project
from app.ai.handlers.test_ai_connection import handle_test_ai_connection


COMMAND_MAP = {
    "generate_file_tree": handle_generate_file_tree,
    "write_file_tree": handle_write_file_tree,
    "undo_last_write": handle_undo_last_write,
    "generate_code_files": handle_generate_code_files,
    "infer_paths": handle_infer_paths,
    "assemble_project": handle_assemble_project,
    "test_ai_connection": handle_test_ai_connection,
}


async def dispatch_command(payload: dict) -> dict:
    """
    Central AI command dispatcher.
    Routes incoming commands to the correct handler.
    """
    command = payload.get("command")
    if not command:
        return {"error": "Missing 'command' in payload"}

    handler = COMMAND_MAP.get(command)
    if not handler:
        return {"error": f"Unknown command '{command}'"}

    return await handler(payload)
