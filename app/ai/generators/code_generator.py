import re
from app.ai.inference.path_inference import path_inference

class CodeGenerator:
    """
    Extracts code blocks from AI responses and converts them into
    a structured file map ready for writing.
    """

    CODE_BLOCK_PATTERN = re.compile(
        r"```(?P<lang>[a-zA-Z0-9]*)\n(?P<code>.*?)```",
        re.DOTALL
    )

    def extract_code_blocks(self, ai_text: str):
        blocks = []
        for match in self.CODE_BLOCK_PATTERN.finditer(ai_text):
            lang = match.group("lang") or "text"
            code = match.group("code").strip()
            blocks.append({"lang": lang, "code": code})
        return blocks

    def generate_file_map(self, ai_text: str):
        """
        Extract code blocks + infer paths → produce file map.
        """
        blocks = self.extract_code_blocks(ai_text)
        paths = path_inference.extract_paths(ai_text)

        file_map = path_inference.map_blocks_to_paths(blocks, paths)

        return {
            "files": file_map,
            "block_count": len(blocks),
            "path_count": len(paths)
        }


# Global instance
code_generator = CodeGenerator()
