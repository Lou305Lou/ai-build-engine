import json

from engine.command_router import CommandRouter
<<<<<<< HEAD
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
=======
from engine.tasks import (
    task_generate_project,
    task_explain,
    task_generate_project_structure
)
from engine.engine_registry import EngineRegistry
from engine.file_writer import FileWriter
from engine.history_manager import HistoryManager
from engine.diff_preview import DiffPreview
from engine.tree_preview import build_tree_structure, render_tree


class AICloudApp:
    def __init__(self):
        self.registry = EngineRegistry()

>>>>>>> da645af (Save local changes before rebase)
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

<<<<<<< HEAD
        # Active engine (starts as default)
        self.active_engine = self.registry.get("default")

        # Command router
        self.router = CommandRouter()

        # Register available tasks (they receive the active engine)
        self._bind_tasks()

    def _bind_tasks(self):
        """
        Bind tasks to the current active engine.
        Call this again after switching engines.
        """
=======
        self.active_engine_name = "default"
        self.active_engine = self.registry.get(self.active_engine_name)

        self.router = CommandRouter()
        self.file_writer = FileWriter()
        self.history = HistoryManager()
        self.diff_preview = DiffPreview()

        self._bind_tasks()

    def _bind_tasks(self):
>>>>>>> da645af (Save local changes before rebase)
        self.router.register(
            "generate_project",
            lambda prompt: task_generate_project(prompt, self.active_engine)
        )
        self.router.register(
            "explain",
            lambda prompt: task_explain(prompt, self.active_engine)
        )
<<<<<<< HEAD

    def run(self):
        """
        Interactive command loop.
        """
        print("\n🚀 AI Cloud Engine Online")
        print("Available commands:")
        print("  /engine <name>              # switch engine (default, betting, ...)")
        print("  /generate_project <prompt>")
=======
        self.router.register(
            "generate_structure",
            lambda prompt: task_generate_project_structure(prompt, self.active_engine)
        )

    # ---------------- ENGINE COMMANDS ----------------

    def list_engines(self):
        print("\nAvailable engines:")
        for name in self.registry.engines.keys():
            marker = " (active)" if name == self.active_engine_name else ""
            print(f"  - {name}{marker}")
        print()

    def show_current_engine(self):
        print(f"\nCurrent engine: {self.active_engine_name}\n")

    def switch_engine(self, name):
        try:
            self.active_engine = self.registry.get(name)
            self.active_engine_name = name
            self._bind_tasks()
            print(f"Switched to engine: {name}")
        except Exception as e:
            print(str(e))

    # ---------------- FILE WRITER COMMANDS ----------------

    def write_file_command(self, user_input):
        parts = user_input.split(" ", 2)
        if len(parts) < 3:
            print("Usage: /write_file <path> <content>")
            return

        path = parts[1]
        content = parts[2]

        result = self.file_writer.write_file(path, content)
        print(json.dumps(result, indent=2))

    def write_project_command(self, user_input):
        json_str = user_input.replace("/write_project", "").strip()

        try:
            structure = json.loads(json_str)
        except Exception as e:
            print(f"Invalid JSON: {e}")
            return

        result = self.file_writer.write_project(structure)
        print(json.dumps(result, indent=2))

    # ---------------- DRY RUN ----------------

    def dry_run_command(self, prompt):
        print("\n🔍 Running dry-run (no files will be written)...\n")

        result = self.router.execute("generate_structure", prompt=prompt)
        if result.get("status") != "ok":
            print(json.dumps(result, indent=2))
            return

        project = result["project"]
        files = [f["path"] for f in project.get("files", [])]

        tree, file_count, folder_count = build_tree_structure(files)
        tree_lines = render_tree(tree)

        print("📁 Project Structure Preview")
        print("---------------------------")
        for line in tree_lines:
            print(line)

        print(f"\n📊 Summary: {file_count} files, {folder_count} folders\n")

        diff = self.diff_preview.compute_diff(files)

        print("📝 Diff Preview (no changes will be made)")
        print("----------------------------------------")
        for line in diff["all"]:
            print(line)

        print("\n✨ Dry-run complete. No files were written.\n")

    # ---------------- UNDO ----------------

    def undo_command(self):
        print("\n⏪ Undoing last generation...\n")

        snapshot = self.history.load_last_snapshot()
        if not snapshot:
            print("❌ No history found. Nothing to undo.\n")
            return

        self.history.restore_snapshot(snapshot)

        print("✅ Undo complete. Project restored to previous state.\n")

    # ---------------- MAIN LOOP ----------------

    def run(self):
        print("\n🚀 AI Cloud Engine Online")
        print("Available commands:")
        print("  /engine list                # list all engines")
        print("  /engine current             # show active engine")
        print("  /engine <name>              # switch engine")
        print("  /write_file <path> <content>")
        print("  /write_project <json>")
        print("  /generate_project <prompt>")
        print("  /generate_structure <prompt>")
        print("  /preview_structure <prompt>")
        print("  /dry_run <prompt>")
        print("  /undo")
>>>>>>> da645af (Save local changes before rebase)
        print("  /explain <prompt>")
        print("  /exit\n")

        while True:
            user_input = input("> ").strip()

            if user_input == "/exit":
                print("Shutting down engine.")
                break

<<<<<<< HEAD
            # Switch active engine
            if user_input.startswith("/engine"):
                parts = user_input.split()
                if len(parts) < 2:
                    print("Usage: /engine <name>")
                    continue

                engine_name = parts[1]
                try:
                    self.active_engine = self.registry.get(engine_name)
                    self._bind_tasks()
                    print(f"Switched to engine: {engine_name}")
                except Exception as e:
                    print(str(e))
                continue

            # Generate project
=======
            if user_input.startswith("/engine"):
                parts = user_input.split()

                if len(parts) == 1:
                    print("Usage: /engine <name> | list | current")
                    continue

                cmd = parts[1]

                if cmd == "list":
                    self.list_engines()
                    continue

                if cmd == "current":
                    self.show_current_engine()
                    continue

                self.switch_engine(cmd)
                continue

            if user_input.startswith("/write_file"):
                self.write_file_command(user_input)
                continue

            if user_input.startswith("/write_project"):
                self.write_project_command(user_input)
                continue

>>>>>>> da645af (Save local changes before rebase)
            if user_input.startswith("/generate_project"):
                prompt = user_input.replace("/generate_project", "").strip()
                result = self.router.execute("generate_project", prompt=prompt)
                print(json.dumps(result, indent=2))
                continue

<<<<<<< HEAD
            # Explain
=======
            if user_input.startswith("/generate_structure"):
                prompt = user_input.replace("/generate_structure", "").strip()

                before_state = self.history.capture_state()

                result = self.router.execute("generate_structure", prompt=prompt)

                if result.get("status") == "ok":
                    project = result["project"]

                    write_result = self.file_writer.write_project(project)

                    after_state = self.history.capture_state()

                    self.history.save_snapshot(
                        prompt=prompt,
                        project_json=project,
                        before_state=before_state,
                        after_state=after_state
                    )

                    total_files = len(project.get("files", []))
                    print(f"\nGenerated {total_files} files.\n")
                    print(json.dumps(write_result, indent=2))
                else:
                    print(json.dumps(result, indent=2))
                continue

            if user_input.startswith("/preview_structure"):
                prompt = user_input.replace("/preview_structure", "").strip()
                result = self.router.execute("generate_structure", prompt=prompt)

                if result.get("status") == "ok":
                    project = result["project"]
                    files = [f["path"] for f in project.get("files", [])]

                    tree, file_count, folder_count = build_tree_structure(files)
                    tree_lines = render_tree(tree)

                    print(f"\nProject Structure ({file_count} files, {folder_count} folders):\n")
                    for line in tree_lines:
                        print(line)
                    print()

                else:
                    print(json.dumps(result, indent=2))
                continue

            if user_input.startswith("/dry_run"):
                prompt = user_input.replace("/dry_run", "").strip()
                self.dry_run_command(prompt)
                continue

            if user_input.startswith("/undo"):
                self.undo_command()
                continue

>>>>>>> da645af (Save local changes before rebase)
            if user_input.startswith("/explain"):
                prompt = user_input.replace("/explain", "").strip()
                result = self.router.execute("explain", prompt=prompt)
                print(json.dumps(result, indent=2))
                continue

<<<<<<< HEAD
            print("Unknown command. Try /engine, /generate_project, or /explain.")
=======
            print("Unknown command. Try /engine, /write_file, /write_project, /generate_project, /generate_structure, /preview_structure, /dry_run, /undo, or /explain.")
>>>>>>> da645af (Save local changes before rebase)


if __name__ == "__main__":
    app = AICloudApp()
    app.run()
<<<<<<< HEAD

=======
>>>>>>> da645af (Save local changes before rebase)
