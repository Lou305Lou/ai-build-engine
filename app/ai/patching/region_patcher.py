import os
from typing import Dict
from app.ai.client import ai_model_client

class RegionPatcher:
    """
    Region-aware patching engine.

    Strategy:
      - Read existing file content
      - Provide file + region hint + instruction to AI
      - AI returns FULL updated file
      - We overwrite the file (snapshots handled by higher layers)
    """

    async def patch_region(self, file_path: str, region_hint: str, instruction: str) -> Dict:
        if not os.path.exists(file_path):
            return {"error": "File does not exist", "file_path": file_path}

        with open(file_path, "r", encoding="utf-8") as f:
            original_content = f.read()

        prompt = self._build_region_prompt(file_path, original_content, region_hint, instruction)
        updated_content = await ai_model_client.generate(prompt)

        if isinstance(updated_content, str) and updated_content.startswith("[ERROR]"):
            return {
                "error": "AI region patching failed",
                "detail": updated_content,
                "file_path": file_path,
            }

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated_content)

        return {
            "file_path": file_path,
            "status": "region_patched",
        }

    def _build_region_prompt(
        self,
        file_path: str,
        original: str,
        region_hint: str,
        instruction: str,
    ) -> str:
        return f"""
You are an AI code editor.

You will receive:
1) The path of a file in a codebase.
2) The current full content of that file.
3) A REGION HINT describing what part of the file to modify.
4) A high-level instruction describing how to modify that region.

Your job:
- Identify the region based on the REGION HINT.
- Apply the instruction ONLY to that region.
- Keep the rest of the file unchanged.
- Return the FULL UPDATED FILE CONTENT.
- Do NOT include markdown fences.
- Do NOT add explanations.
- Only output the final file content.

File path:
{file_path}

Region hint (what to target):
{region_hint}

Instruction (what to do to that region):
{instruction}

Current file content:
<<<FILE_START>>>
{original}
<<<FILE_END>>>

Now respond with ONLY the full updated file content.
"""


# Global instance
region_patcher = RegionPatcher()
