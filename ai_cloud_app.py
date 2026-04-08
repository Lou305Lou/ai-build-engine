
import json

from engine.openrouter_client import OpenRouterClient
from engine.command_router import CommandRouter
from engine.tasks import task_generate_project, task_explain
from engine.engine_registry import EngineRegistry


class AICloudApp:
    """
    Central cloud-based AI engine that routes commands,
    supports multiple engines, enforces JSON output,
    and performs heavy-lift tasks.
    """

    def __init__(self):
        # Engine registry: holds multiple logical engines
        self.registry = EngineRegistry()

        # Register engines (you can add more later)
        self.registry.register_engine(
            name="default",
            model="qwen/qwen-2.5-7b-instruct",
            system_prompt="You are the AI Cloud Engine."
        )

        self.registry.register_engine(
            name="betting",
            model="qwen/qwen-2.5-7b-instruct",
            system_prompt="You are the Betting Micro-Engine."
        )

        # Active engine (starts as default)
        self.active_engine = self.registry.get("default")

        # Command router
        self.router = CommandRouter()

        # Register available tasks (they receive the active engine)
        self.router.register(
            "generate_project",
            lambda prompt: task_generate_project(prompt, self.active_engine)
        )

        self.router.register(
            "explain",
            lambda prompt: task_explain(prompt, self.active_engine)
        )

    def run(self):
        """
        Interactive command loop.
        """
        print("\n🚀 AI Cloud Engine Online")
        print("Available commands:")
        print("  /engine <name>          # switch engine (default, betting, ...)")
        print("  /generate_project <prompt>")
        print("  /explain <prompt>")
        print("  /exit\n")

        while True:
            user_input = input("> ").strip()

            if user_input == "/exit":
                print("Shutting down engine.")
                break

            # Switch active engine
            if user_input.startswith("/engine"):
                parts = user_input.split()
                if len(parts) < 2:
                    print("Usage: /engine <name>")
                    continue

                engine_name = parts[1]
                try:
                    self.active_engine = self.registry.get(engine_name)
                    print(f"Switched to engine: {engine_name}")

                    # Re-bind tasks to new active engine
                    self.router.register(
                        "generate_project",
                        lambda prompt: task_generate_project(prompt, self.active_engine)
                    )
                    self.router.register(
                        "explain",
                        lambda prompt: task_explain(prompt, self.active_engine)
                    )
                except Exception as e:
                    print(str(e))
                continue

            # Generate project
            if user_input.startswith("/generate_project"):
                prompt = user_input.replace("/generate_project", "").strip()
                result = self.router.execute("generate_project", prompt=prompt)
                print(json.dumps(result, indent=2))
                continue

            # Explain
            if user_input.startswith("/explain"):
                prompt = user_input.replace("/explain", "").strip()
                result = self.router.execute("explain", prompt=prompt)
                print(json.dumps(result, indent=2))
                continue

            print("Unknown command. Try /engine, /generate_project, or /explain.")


if __name__ == "__main__":
    app = AICloudApp()
    app.run()
