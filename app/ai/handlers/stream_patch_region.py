from app.ai.patching.region_patcher import region_patcher
from app.ai.events.event_builder import event_builder
from app.ai.client import ai_model_client

async def handle_stream_patch_region(payload: dict):
    """
    Streaming version of region patching.
    Emits structured SSE events for dashboards and terminals.
    """

    file_path = payload.get("file_path")
    region_hint = payload.get("region_hint")
    instruction = payload.get("instruction")

    if not file_path or not region_hint or not instruction:
        yield event_builder.error(
            "region_patch_error",
            "Missing 'file_path', 'region_hint', or 'instruction'",
            stage="region_patch",
            percent=0,
        )
        return

    # 1. Start
    yield event_builder.info(
        "region_patch_started",
        f"Starting region patch for {file_path}",
        stage="region_patch",
        percent=0,
        data={"file_path": file_path, "region_hint": region_hint},
    )

    # 2. Read file
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            original_content = f.read()

        yield event_builder.info(
            "region_patch_file_loaded",
            "Loaded original file content",
            stage="region_patch",
            percent=10,
        )
    except Exception as e:
        yield event_builder.error(
            "region_patch_read_error",
            "Failed to read file",
            stage="region_patch",
            percent=5,
            data={"detail": str(e)},
        )
        return

    # 3. Build prompt and stream AI response
    prompt = region_patcher._build_region_prompt(file_path, original_content, region_hint, instruction)

    yield event_builder.info(
        "region_patch_ai_request",
        "Sending region patch request to AI",
        stage="region_patch",
        percent=20,
    )

    updated_content = ""

    async for chunk in ai_model_client.stream(prompt):
        updated_content += chunk
        yield event_builder.info(
            "region_patch_ai_chunk",
            "Received AI region patch token",
            stage="region_patch",
            percent=30,
            data={"token": chunk},
        )

    # 4. Validate AI output
    if updated_content.startswith("[ERROR]"):
        yield event_builder.error(
            "region_patch_ai_error",
            "AI returned an error during region patching",
            stage="region_patch",
            percent=40,
            data={"detail": updated_content},
        )
        return

    yield event_builder.info(
        "region_patch_ai_complete",
        "AI region patch generation complete",
        stage="region_patch",
        percent=50,
    )

    # 5. Write updated file
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated_content)

        yield event_builder.info(
            "region_patch_written",
            "Region-patched file written to disk",
            stage="region_patch",
            percent=80,
        )
    except Exception as e:
        yield event_builder.error(
            "region_patch_write_error",
            "Failed to write region-patched file",
            stage="region_patch",
            percent=60,
            data={"detail": str(e)},
        )
        return

    # 6. Done
    yield event_builder.info(
        "region_patch_done",
        "Region patch complete",
        stage="complete",
        percent=100,
        data={"file_path": file_path},
    )
