from app.ai.micro_engines.micro_engine_runner import micro_engine_runner


class MicroPipelineRunner:
    """
    Executes an ordered micro-pipeline.
    Each step is a micro-engine with its own input.
    Shared state flows through the pipeline.
    """

    async def run(self, pipeline: list) -> dict:
        state = {}

        for step in pipeline:
            engine = step.get("engine")
            data = step.get("data", {})

            if not engine:
                return {"error": "Pipeline step missing 'engine' field"}

            # Merge shared state into step data
            merged = {**state, **data}

            result = await micro_engine_runner.run(engine, merged)

            if "error" in result:
                return {
                    "engine": engine,
                    "error": result["error"],
                    "state": state,
                }

            # Update shared state with engine output
            output = result.get("output", {})
            if isinstance(output, dict):
                state.update(output)

        return {
            "pipeline": pipeline,
            "state": state,
        }


micro_pipeline_runner = MicroPipelineRunner()
