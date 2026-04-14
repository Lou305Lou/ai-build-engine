class CommandRouter:
    def __init__(self):
        self.tasks = {}

    def register(self, name, func):
        self.tasks[name] = func

    def execute(self, name, **kwargs):
        if name not in self.tasks:
            return {"status": "error", "error": f"Unknown task: {name}"}
        try:
            return self.tasks[name](**kwargs)
        except Exception as e:
            return {"status": "error", "error": str(e)}
