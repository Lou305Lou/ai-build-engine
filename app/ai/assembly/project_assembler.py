from app.ai.handlers.generate_project import handle_generate_project
from app.ai.handlers.generate_file_plan import handle_generate_file_plan
from app.ai.handlers.write_file_tree import handle_write_file_tree

class ProjectAssembler:
    """
    Orchestrates the full project generation pipeline (file-aware):

      1. Generate project design (AI)
      2. Convert AI output → file-aware plan (paths + code)
      3. Build nested file tree
      4. Write files to disk (with snapshots)
    """

    async def assemble(self, payload: dict) -> dict:
        # 1. Generate project design
        design_result = await handle_generate_project(payload)
        design_text = design_result["design"]

        # 2. File-aware plan from AI output
        plan_result = await handle_generate_file_plan({"ai_text": design_text})
        if "error" in plan_result:
            return {
                "status": "error",
                "stage": "file_plan",
                "detail": plan_result,
            }

        tree = plan_result["tree"]

        # 3. Write file tree to disk
        write_result = await handle_write_file_tree({"tree": tree})

        return {
            "pipeline": {
                "design": design_result,
                "file_plan": plan_result,
                "write_result": write_result,
            },
            "status": "complete",
        }


# Global instance
project_assembler = ProjectAssembler()
