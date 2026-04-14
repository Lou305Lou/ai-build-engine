import os
import ast
from typing import Dict, Optional, Tuple, Union
from app.ai.client import ai_model_client

AstNode = Union[ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef]

class ASTRegionPatcher:
    """
    Python AST-aware region patching engine.

    Supports:
      - region_type = "function"  -> def foo(...)
      - region_type = "class"     -> class Foo(...)
      - region_type = "method"    -> def bar(self, ...) inside class Foo

    Strategy:
      - Read existing file content
      - Parse Python AST
      - Locate the target node
      - Extract the exact source segment for that node
      - Ask AI to return UPDATED REGION ONLY
      - Replace that region in the original file
      - Write updated file back to disk
    """

    async def patch_region(
        self,
        file_path: str,
        region_type: str,
        name: str,
        instruction: str,
        class_name: Optional[str] = None,
    ) -> Dict:
        if not os.path.exists(file_path):
            return {"error": "File does not exist", "file_path": file_path}

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                original_content = f.read()
        except Exception as e:
            return {
                "error": "Failed to read file",
                "file_path": file_path,
                "detail": str(e),
            }

        try:
            tree = ast.parse(original_content)
        except SyntaxError as e:
            return {
                "error": "Failed to parse Python file",
                "file_path": file_path,
                "detail": str(e),
            }

        node, node_source = self._locate_region(
            tree,
            original_content,
            region_type=region_type,
            name=name,
            class_name=class_name,
        )

        if node is None or node_source is None:
            return {
                "error": "Region not found",
                "file_path": file_path,
                "region_type": region_type,
                "name": name,
                "class_name": class_name,
            }

        prompt = self._build_region_prompt(
            file_path=file_path,
            region_type=region_type,
            name=name,
            class_name=class_name,
            region_source=node_source,
            instruction=instruction,
        )

        updated_region = await ai_model_client.generate(prompt)

        if isinstance(updated_region, str) and updated_region.startswith("[ERROR]"):
            return {
                "error": "AI region patching failed",
                "detail": updated_region,
                "file_path": file_path,
            }

        # Replace ONLY the first occurrence of the region source
        new_content = original_content.replace(node_source, updated_region, 1)

        try:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
        except Exception as e:
            return {
                "error": "Failed to write updated file",
                "file_path": file_path,
                "detail": str(e),
            }

        return {
            "file_path": file_path,
            "status": "ast_region_patched",
            "region_type": region_type,
            "name": name,
            "class_name": class_name,
        }

    def _locate_region(
        self,
        tree: ast.AST,
        source: str,
        region_type: str,
        name: str,
        class_name: Optional[str] = None,
    ) -> Tuple[Optional[AstNode], Optional[str]]:
        """
        Locate a node and its exact source segment based on region_type + name (+ class_name).
        """
        if region_type == "function":
            for node in ast.walk(tree):
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name == name:
                    return node, ast.get_source_segment(source, node)

        elif region_type == "class":
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef) and node.name == name:
                    return node, ast.get_source_segment(source, node)

        elif region_type == "method":
            if not class_name:
                return None, None
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef) and node.name == class_name:
                    for body_item in node.body:
                        if isinstance(body_item, (ast.FunctionDef, ast.AsyncFunctionDef)) and body_item.name == name:
                            return body_item, ast.get_source_segment(source, body_item)

        return None, None

    def _build_region_prompt(
        self,
        file_path: str,
        region_type: str,
        name: str,
        class_name: Optional[str],
        region_source: str,
        instruction: str,
    ) -> str:
        class_info = f"\nClass name: {class_name}" if class_name else ""
        return f"""
You are an AI Python code editor.

You will receive:
1) The path of a Python file.
2) The type of region to modify (function, class, or method).
3) The name of that region (and class name if it's a method).
4) The CURRENT SOURCE CODE of that region.
5) An instruction describing how to modify that region.

Your job:
- Apply the instruction ONLY to that region.
- Keep the rest of the file unchanged (you will not see it).
- Return ONLY the UPDATED REGION SOURCE CODE.
- Do NOT include markdown fences.
- Do NOT add explanations.
- Do NOT add surrounding code that is not part of the region.

File path:
{file_path}

Region type:
{region_type}

Region name:
{name}{class_info}

Instruction:
{instruction}

Current region source:
<<<REGION_START>>>
{region_source}
<<<REGION_END>>>

Now respond with ONLY the UPDATED REGION SOURCE CODE.
"""


# Global instance
ast_region_patcher = ASTRegionPatcher()
