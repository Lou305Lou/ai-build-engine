import path from "path";
import { writeProjectStructure } from "./utils/fileWriter.js";

export function generateProject(structure, basePath = process.cwd()) {
  const root = path.resolve(basePath);
  writeProjectStructure(structure, root);
  return { status: "ok" };
}
