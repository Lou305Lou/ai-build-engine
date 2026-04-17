import asyncio

class ProcessManager:
    def __init__(self):
        self.tasks = []

    def add(self, coro):
        task = asyncio.create_task(coro)
        self.tasks.append(task)
        return task

    async def wait_all(self):
        if self.tasks:
            await asyncio.gather(*self.tasks)

process_manager = ProcessManager()
