from app.ai.micro_engines.micro_engine_runner import micro_engine_runner


async def handle_run_micro_engine(payload: dict) -> dict:
    """
    AI command: run_micro_engine
    - Executes a single micro-engine with the given name and input
    - Returns the micro-engine output
    """
    engine = payload.get("engine")
    if not engine:
        return {"error": "Missing 'engine' in payload"}

    data = payload.get("data", {})

    result = await micro_engine_runner.run(engine, data)

    return {
        "command": "run_micro_engine",
        "engine": engine,
        "result": result,
    }
