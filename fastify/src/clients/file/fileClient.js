import fs from "fs/promises";

export async function readFile(filePath) {
  return await fs.readFile(filePath, "utf-8");
}

export async function writeFile(filePath, data) {
  await fs.writeFile(filePath, data);
}

export async function renameFile(oldPath, newPath) {
  await fs.rename(oldPath, newPath);
}

export async function exists(filePath) {
  await fs.stat(filePath);
}
