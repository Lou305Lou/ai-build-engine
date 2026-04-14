from typing import Dict, Any

class FilePlanBuilder:
    """
    Builds a nested file tree structure from a flat file map.

    Input:
      {
        "app/models/user.py": "...",
        "app/api/routes/user.py": "...",
        "README.md": "..."
      }

    Output:
      {
        "root": "generated_project",
        "structure": {
          "app": {
            "models": {
              "user.py": "..."
            },
            "api": {
              "routes": {
                "user.py": "..."
              }
            }
          },
          "README.md": "..."
        }
      }
    """

    def build_from_file_map(self, file_map: Dict[str, str], root: str = "generated_project") -> Dict[str, Any]:
        tree: Dict[str, Any] = {}

        for path, content in file_map.items():
            parts = path.split("/")
            current = tree

            for i, part in enumerate(parts):
                is_last = i == len(parts) - 1

                if is_last:
                    # File
                    current[part] = content
                else:
                    # Folder
                    if part not in current or not isinstance(current.get(part), dict):
                        current[part] = {}
                    current = current[part]

        return {
            "root": root,
            "structure": tree,
        }


# Global instance
file_plan_builder = FilePlanBuilder()
