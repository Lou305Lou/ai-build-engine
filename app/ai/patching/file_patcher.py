import os
from typing import Dict
from app.ai.client import ai_model_client

class FilePatcher:
    """
    File-aware patching engine.

    Strategy (safe, deterministic):
      - Read existing file content
      - Send content + instruction to AI
      - AI returns FULL updated file
      - We overwrite the file
    """

    async def patch_file(self, file_path: str, instruction: str) -> Dict:
        if not os.path.exists(file_path):
            return {"error": "File does not exist", "file_path": file_path}

        with open(file_path, "r", encoding="utf-8") as f:
            original_content = f.read()

        prompt = self._build_patch_prompt(file_path, original_content, instruction)
        updated_content = await ai_model_client.generate(prompt)

        if isinstance(updated_content, str) and updated_content.startswith("[ERROR]"):
            return {
                "error": "AI patching failed",
                "detail": updated_content,
                "file_path": file_path,
            }

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated_content)

        return {
            "file_path": file_path,
            "status": "patched",
        }

    def _build_patch_prompt(self, file_path: str, original: str, instruction: str) -> str:
        return f"""
You are an AI code editor.

You will receive:
1) The path of a file in a codebase.
2) The current full content of that file.
3) A high-level instruction describing how to modify the file.

Your job:
- Apply the instruction to the file.
- Return the FULL UPDATED FILE CONTENT.
- Do NOT include markdown fences.
- Do NOT add explanations.
- Only output the final file content.

File path:
{file_path}

Instruction:
{instruction}

Current file content:
<<<FILE_START>>>
{original}
<<<FILE_END>>>

Now respond with ONLY the full updated file content.
"""


# Global instance
file_patcher = FilePatcher()
