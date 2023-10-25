import fs from "fs/promises";
import path from "path";

export async function readFile(filePath) {
  return await fs.readFile(filePath, "utf-8");
}

export async function makeDirectoryIfNotExists(filePath) {
  const directory = path.dirname(filePath);
  if (!await exists(directory)) {
    await fs.mkdir(directory, { recursive: true });
  }
}

export async function writeFile(filePath, data) {
  await makeDirectoryIfNotExists(filePath);
  await fs.writeFile(filePath, data);
}

export async function renameFile(oldPath, newPath) {
  await fs.rename(oldPath, newPath);
}

export async function exists(filePath) {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readDirectory(directoryPath, options) {
  return await fs.readdir(directoryPath, options);
}

export async function unlink(directoryPath) {
  return await fs.unlink(directoryPath);
}