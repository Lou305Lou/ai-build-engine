from app.ai.client import ai_model_client
from app.ai.handlers.generate_file_tree import handle_generate_file_tree
from app.ai.handlers.infer_paths import handle_infer_paths
from app.ai.handlers.generate_code_files import handle_generate_code_files
from app.ai.handlers.write_file_tree import handle_write_file_tree
from app.ai.events.event_builder import event_builder

class LiveAssembler:
    """
    Streaming version of the project assembly pipeline.
    Emits structured SSE events with error handling.
    """

    async def assemble_stream(self, payload: dict):
        try:
            # 1. Start
            yield event_builder.info("start", "Starting project assembly", stage="init", percent=0)

            # 2. Generate project design (streaming)
            yield event_builder.info("design_started", "Generating project design", stage="design", percent=0)

            async for chunk in ai_model_client.stream(
                payload.get("prompt", "Generate a project design.")
            ):
                yield event_builder.info(
                    "design_chunk",
                    "Received design token",
                    stage="design",
                    data={"token": chunk},
                )

            # Final design text (non-streaming)
            design_text = await ai_model_client.generate(
                payload.get("prompt", "Generate a project design.")
            )
            if design_text.startswith("[ERROR]"):
                yield event_builder.error(
                    "design_error",
                    "Error during design generation",
                    stage="design",
                    percent=5,
                    data={"detail": design_text},
                )
                yield event_builder.error("done", "Assembly aborted due to design error", stage="error", percent=100)
                return

            yield event_builder.info("design_complete", "Project design complete", stage="design", percent=20)

            # 3. File tree generation
            yield event_builder.info("file_tree_started", "Generating file tree", stage="file_tree", percent=20)
            tree_result = await handle_generate_file_tree({"design": design_text})
            if "error" in tree_result:
                yield event_builder.error(
                    "file_tree_error",
                    "Error during file tree generation",
                    stage="file_tree",
                    percent=25,
                    data={"detail": tree_result},
                )
                yield event_builder.error("done", "Assembly aborted due to file tree error", stage="error", percent=100)
                return

            yield event_builder.info("file_tree_complete", "File tree generated", stage="file_tree", percent=40)

            # 4. Path inference
            yield event_builder.info("path_inference_started", "Inferring file paths", stage="paths", percent=40)
            path_result = await handle_infer_paths({"ai_text": design_text})
            if "error" in path_result:
                yield event_builder.warning(
                    "path_inference_warning",
                    "Path inference encountered an issue; continuing with defaults",
                    stage="paths",
                    percent=45,
                    data={"detail": path_result},
                )
            else:
                yield event_builder.info("path_inference_complete", "Path inference complete", stage="paths", percent=55)

            # 5. Code extraction
            yield event_builder.info("code_extraction_started", "Extracting code blocks", stage="code", percent=55)
            code_result = await handle_generate_code_files({"ai_text": design_text})
            if "error" in code_result:
                yield event_builder.error(
                    "code_extraction_error",
                    "Error during code extraction",
                    stage="code",
                    percent=60,
                    data={"detail": code_result},
                )
                yield event_builder.error("done", "Assembly aborted due to code extraction error", stage="error", percent=100)
                return

            yield event_builder.info("code_extraction_complete", "Code extraction complete", stage="code", percent=70)

            # 6. Write files
            yield event_builder.info("writing_started", "Writing files to disk", stage="write", percent=70)
            write_result = await handle_write_file_tree({"tree": tree_result["tree"]})
            if "error" in write_result:
                yield event_builder.error(
                    "writing_error",
                    "Error while writing files",
                    stage="write",
                    percent=80,
                    data={"detail": write_result},
                )
                yield event_builder.error("done", "Assembly aborted due to write error", stage="error", percent=100)
                return

            yield event_builder.info("writing_complete", "Files written to disk", stage="write", percent=90)

            # 7. Done
            yield event_builder.info("done", "Project assembly complete", stage="complete", percent=100)

        except Exception as e:
            # Global catch-all
            yield event_builder.error(
                "unexpected_error",
                "Unexpected error during assembly",
                stage="unknown",
                percent=100,
                data={"detail": str(e)},
            )
            yield event_builder.error("done", "Assembly aborted due to unexpected error", stage="error", percent=100)


# Global instance
live_assembler = LiveAssembler()
