from app.ai.pipeline.pipeline_runner import pipeline_runner


async def handle_run_pipeline(payload: dict) -> dict:
    """
    AI command: run_pipeline
    - Executes a full multi-step AI pipeline
    - Returns the pipeline execution result
    """
    pipeline = payload.get("pipeline")
    if not pipeline:
        return {"error": "Missing 'pipeline' in payload"}

    result = await pipeline_runner.run(pipeline)

    return {
        "command": "run_pipeline",
        "result": result,
    }
