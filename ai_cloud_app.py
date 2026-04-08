
import json
from engine.openrouter_client import OpenRouterClient
from engine.command_router import CommandRouter
from engine.tasks import task_generate_project, task_explain


class AICloudApp:
    """
    Central cloud-based AI engine that routes commands,
    enforces JSON output, and performs heavy-lift tasks.
    """

    def __init__(self, model="qwen/qwen-2.5-7b-instruct"):
        self.client = OpenRouterClient()
        self.model = model
        self.router = CommandRouter()

        # Register available tasks
        self.router.register(
            "generate_project",
            lambda prompt: task_generate_project(prompt, self.client)
        )

        self.router.register(
            "explain",
            lambda prompt: task_explain(prompt, self.client)
        )

    def run(self):
        """
        Interactive command loop.
        """
        print("\n🚀 AI Cloud Engine Online")
        print("Available commands:")
        print("  /generate_project <prompt>")
        print("  /explain <prompt>")
        print("  /exit\n")

        while True:
            user_input = input("> ").strip()

            if user_input == "/exit":
                print("Shutting down engine.")
                break

            if user_input.startswith("/generate_project"):
                prompt = user_input.replace("/generate_project", "").strip()
                result = self.router.execute("generate_project", prompt=prompt)
                print(json.dumps(result, indent=2))
                continue

            if user_input.startswith("/explain"):
                prompt = user_input.replace("/explain", "").strip()
                result = self.router.execute("explain", prompt=prompt)
                print(json.dumps(result, indent=2))
                continue

            print("Unknown command. Try /generate_project or /explain.")


if __name__ == "__main__":
    app = AICloudApp()
    app.run()
