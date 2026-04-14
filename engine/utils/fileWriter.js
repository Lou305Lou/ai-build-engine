import fs from "fs";
import path from "path";

export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeFileSafe(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

export function writeProjectStructure(structure, basePath) {
  for (const filePath in structure) {
    const fullPath = path.join(basePath, filePath);
    const content = structure[filePath];
    writeFileSafe(fullPath, content);
  }
}
