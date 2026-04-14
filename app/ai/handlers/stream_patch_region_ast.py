from app.ai.patching.ast_region_patcher import ast_region_patcher
from app.ai.events.event_builder import event_builder
from app.ai.client import ai_model_client
import ast

async def handle_stream_patch_region_ast(payload: dict):
    """
    Streaming AST-aware region patching for Python files.
    Emits structured SSE events.
    """

    file_path = payload.get("file_path")
    region_type = payload.get("region_type")
    name = payload.get("name")
    class_name = payload.get("class_name")
    instruction = payload.get("instruction")

    if not file_path or not region_type or not name or not instruction:
        yield event_builder.error(
            "ast_region_patch_error",
            "Missing 'file_path', 'region_type', 'name', or 'instruction'",
            stage="ast_region_patch",
            percent=0,
            data={"payload": payload},
        )
        return

    # 1. Start
    yield event_builder.info(
        "ast_region_patch_started",
        f"Starting AST region patch for {file_path}",
        stage="ast_region_patch",
        percent=0,
        data={
            "file_path": file_path,
            "region_type": region_type,
            "name": name,
            "class_name": class_name,
        },
    )

    # 2. Read file
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            original_content = f.read()

        yield event_builder.info(
            "ast_region_patch_file_loaded",
            "Loaded original file content",
            stage="ast_region_patch",
            percent=10,
        )
    except Exception as e:
        yield event_builder.error(
            "ast_region_patch_read_error",
            "Failed to read file",
            stage="ast_region_patch",
            percent=5,
            data={"detail": str(e)},
        )
        return

    # 3. Parse AST and locate region
    try:
        tree = ast.parse(original_content)
    except SyntaxError as e:
        yield event_builder.error(
            "ast_region_patch_parse_error",
            "Failed to parse Python file",
            stage="ast_region_patch",
            percent=8,
            data={"detail": str(e)},
        )
        return

    node, node_source = ast_region_patcher._locate_region(
        tree,
        original_content,
        region_type=region_type,
        name=name,
        class_name=class_name,
    )

    if node is None or node_source is None:
        yield event_builder.error(
            "ast_region_patch_not_found",
            "Region not found in AST",
            stage="ast_region_patch",
            percent=12,
            data={
                "region_type": region_type,
                "name": name,
                "class_name": class_name,
            },
        )
        return

    yield event_builder.info(
        "ast_region_patch_region_located",
        "Target region located in AST",
        stage="ast_region_patch",
        percent=20,
    )

    # 4. Build prompt and stream AI response
    prompt = ast_region_patcher._build_region_prompt(
        file_path=file_path,
        region_type=region_type,
        name=name,
        class_name=class_name,
        region_source=node_source,
        instruction=instruction,
    )

    yield event_builder.info(
        "ast_region_patch_ai_request",
        "Sending AST region patch request to AI",
        stage="ast_region_patch",
        percent=30,
    )

    updated_region = ""

    async for chunk in ai_model_client.stream(prompt):
        updated_region += chunk
        yield event_builder.info(
            "ast_region_patch_ai_chunk",
            "Received AST region patch token",
            stage="ast_region_patch",
            percent=40,
            data={"token": chunk},
        )

    if updated_region.startswith("[ERROR]"):
        yield event_builder.error(
            "ast_region_patch_ai_error",
            "AI returned an error during AST region patching",
            stage="ast_region_patch",
            percent=50,
            data={"detail": updated_region},
        )
        return

    yield event_builder.info(
        "ast_region_patch_ai_complete",
        "AST region patch generation complete",
        stage="ast_region_patch",
        percent=60,
    )

    # 5. Replace region in original content
    new_content = original_content.replace(node_source, updated_region, 1)

    # 6. Write updated file
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)

        yield event_builder.info(
            "ast_region_patch_written",
            "AST region-patched file written to disk",
            stage="ast_region_patch",
            percent=85,
        )
    except Exception as e:
        yield event_builder.error(
            "ast_region_patch_write_error",
            "Failed to write AST region-patched file",
            stage="ast_region_patch",
            percent=70,
            data={"detail": str(e)},
        )
        return

    # 7. Done
    yield event_builder.info(
        "ast_region_patch_done",
        "AST region patch complete",
        stage="complete",
        percent=100,
        data={"file_path": file_path},
    )
