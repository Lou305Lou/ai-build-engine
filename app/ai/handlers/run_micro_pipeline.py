from app.ai.micro_engines.micro_pipeline_runner import micro_pipeline_runner


async def handle_run_micro_pipeline(payload: dict) -> dict:
    """
    AI command: run_micro_pipeline
    - Executes a full micro‑pipeline (ordered micro‑engines)
    - Returns the pipeline output
    """
    pipeline = payload.get("pipeline")
    if not pipeline:
        return {"error": "Missing 'pipeline' in payload"}

    result = await micro_pipeline_runner.run(pipeline)

    return {
        "command": "run_micro_pipeline",
        "result": result,
    }
