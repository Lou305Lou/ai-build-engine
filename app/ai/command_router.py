from fastapi import HTTPException
from app.ai.handlers import (
    handle_generate_project,
    handle_generate_file_tree,
    handle_write_file_tree,
    handle_undo_last_write,
    handle_generate_code_files,
    handle_infer_paths,
    handle_assemble_project,
    handle_test_ai_connection,
    handle_stream_ai_response,
    handle_stream_assemble_project,
    handle_generate_file_plan,
    handle_patch_file,
    handle_stream_patch_file,
    handle_patch_region,
    handle_stream_patch_region,
    handle_patch_region_ast,
    handle_stream_patch_region_ast,
)


class AICommandRouter:
    """
    Central dispatcher for all AI Cloud Engine commands.
    """

    def __init__(self):
        self.commands = {}
        self._register_builtin_commands()

    def _register_builtin_commands(self):
        self.register("generate_project", handle_generate_project)
        self.register("generate_file_tree", handle_generate_file_tree)
        self.register("write_file_tree", handle_write_file_tree)
        self.register("undo_last_write", handle_undo_last_write)
        self.register("generate_code_files", handle_generate_code_files)
        self.register("infer_paths", handle_infer_paths)
        self.register("assemble_project", handle_assemble_project)
        self.register("test_ai_connection", handle_test_ai_connection)
        self.register("stream_ai_response", handle_stream_ai_response)
        self.register("stream_assemble_project", handle_stream_assemble_project)
        self.register("generate_file_plan", handle_generate_file_plan)
        self.register("patch_file", handle_patch_file)
        self.register("stream_patch_file", handle_stream_patch_file)
        self.register("patch_region", handle_patch_region)
        self.register("stream_patch_region", handle_stream_patch_region)
        self.register("patch_region_ast", handle_patch_region_ast)
        self.register("stream_patch_region_ast", handle_stream_patch_region_ast)

    def register(self, command_name: str, handler):
        self.commands[command_name] = handler

    async def execute(self, command_name: str, payload: dict):
        if command_name not in self.commands:
            raise HTTPException(status_code=400, detail=f"Unknown command: {command_name}")

        handler = self.commands[command_name]

        # Streaming commands return generators
        if command_name in [
            "stream_ai_response",
            "stream_assemble_project",
            "stream_patch_file",
            "stream_patch_region",
            "stream_patch_region_ast",
        ]:
            return handler(payload)

        return await handler(payload)


ai_command_router = AICommandRouter()
