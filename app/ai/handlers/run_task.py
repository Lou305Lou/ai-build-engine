from app.ai.tasks.task_runner import task_runner


async def handle_run_task(payload: dict) -> dict:
    """
    AI command: run_task
    - Executes a structured AI task object
    - Returns the task runner result
    """
    task = payload.get("task")
    if not task:
        return {"error": "Missing 'task' in payload"}

    result = await task_runner.run(task)

    return {
        "command": "run_task",
        "result": result,
    }
