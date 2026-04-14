import re

class PathInference:
    """
    Extracts filenames and directory paths from AI output.
    """

    # Matches patterns like:
    #   app/main.py
    #   src/components/Button.tsx
    #   backend/api/routes/user.py
    PATH_PATTERN = re.compile(
        r"(?P<path>(?:[a-zA-Z0-9_\-]+/)+[a-zA-Z0-9_\-]+\.[a-zA-Z0-9]+)"
    )

    def extract_paths(self, ai_text: str):
        """
        Return a list of file paths mentioned in the AI output.
        """
        return list({m.group("path") for m in self.PATH_PATTERN.finditer(ai_text)})

    def map_blocks_to_paths(self, blocks, paths):
        """
        Map code blocks to inferred paths.
        If paths < blocks, assign remaining blocks generic names.
        """
        file_map = {}

        for i, block in enumerate(blocks):
            if i < len(paths):
                file_map[paths[i]] = block["code"]
            else:
                # fallback
                file_map[f"generated_file_{i+1}.txt"] = block["code"]

        return file_map


# Global instance
path_inference = PathInference()

