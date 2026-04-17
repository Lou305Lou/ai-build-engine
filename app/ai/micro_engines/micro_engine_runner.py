from app.ai.micro_engines.registry import get_micro_engine


class MicroEngineRunner:
    """
    Executes a single micro-engine by name.
    """

    async def run(self, engine_name: str, data: dict) -> dict:
        engine = get_micro_engine(engine_name)
        if engine is None:
            return {"error": f"Micro-engine '{engine_name}' not found"}

        try:
            result = await engine(data)
        except Exception as e:
            return {"error": str(e)}

        return {
            "engine": engine_name,
            "output": result,
        }


micro_engine_runner = MicroEngineRunner()
