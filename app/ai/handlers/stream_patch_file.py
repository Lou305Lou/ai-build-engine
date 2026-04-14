from app.ai.patching.file_patcher import file_patcher
from app.ai.events.event_builder import event_builder
from app.ai.client import ai_model_client

async def handle_stream_patch_file(payload: dict):
    """
    Streaming version of file patching.
    Emits structured SSE events for dashboards and terminals.
    """

    file_path = payload.get("file_path")
    instruction = payload.get("instruction")

    if not file_path or not instruction:
        yield event_builder.error(
            "patch_error",
            "Missing 'file_path' or 'instruction'",
            stage="patch",
            percent=0,
        )
        return

    # 1. Start
    yield event_builder.info(
        "patch_started",
        f"Starting patch for {file_path}",
        stage="patch",
        percent=0,
        data={"file_path": file_path},
    )

    # 2. Read file
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            original_content = f.read()

        yield event_builder.info(
            "patch_file_loaded",
            "Loaded original file content",
            stage="patch",
            percent=10,
        )
    except Exception as e:
        yield event_builder.error(
            "patch_read_error",
            "Failed to read file",
            stage="patch",
            percent=5,
            data={"detail": str(e)},
        )
        return

    # 3. Build prompt and stream AI response
    prompt = file_patcher._build_patch_prompt(file_path, original_content, instruction)

    yield event_builder.info(
        "patch_ai_request",
        "Sending patch request to AI",
        stage="patch",
        percent=20,
    )

    updated_content = ""

    async for chunk in ai_model_client.stream(prompt):
        updated_content += chunk
        yield event_builder.info(
            "patch_ai_chunk",
            "Received AI patch token",
            stage="patch",
            percent=30,
            data={"token": chunk},
        )

    # 4. Validate AI output
    if updated_content.startswith("[ERROR]"):
        yield event_builder.error(
            "patch_ai_error",
            "AI returned an error during patching",
            stage="patch",
            percent=40,
            data={"detail": updated_content},
        )
        return

    yield event_builder.info(
        "patch_ai_complete",
        "AI patch generation complete",
        stage="patch",
        percent=50,
    )

    # 5. Write updated file
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated_content)

        yield event_builder.info(
            "patch_written",
            "Patched file written to disk",
            stage="patch",
            percent=80,
        )
    except Exception as e:
        yield event_builder.error(
            "patch_write_error",
            "Failed to write patched file",
            stage="patch",
            percent=60,
            data={"detail": str(e)},
        )
        return

    # 6. Done
    yield event_builder.info(
        "patch_done",
        "File patch complete",
        stage="complete",
        percent=100,
        data={"file_path": file_path},
    )
