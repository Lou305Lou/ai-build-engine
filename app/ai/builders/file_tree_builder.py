class FileTreeBuilder:
    """
    Converts AI-generated project descriptions into a structured file tree plan.
    This does NOT write files yet — it only produces a structured representation.
    """

    def build_tree(self, design_text: str) -> dict:
        """
        Parse the AI design text and extract a file tree structure.

        For now:
          - This is a stub that returns a deterministic example.
          - In later chunks, this will parse the AI output into a real tree.
        """
        return {
            "root": "generated_project",
            "structure": {
                "app": {
                    "main.py": "# main entry",
                    "api": {
                        "__init__.py": "",
                        "routes.py": "# routes"
                    },
                    "models": {
                        "__init__.py": "",
                        "user.py": "# user model"
                    }
                },
                "requirements.txt": "fastapi\nuvicorn\n"
            }
        }


# Global instance
file_tree_builder = FileTreeBuilder()
