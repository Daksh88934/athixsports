import fs from "fs/promises";
import fs_sync from "fs";
import path from "path";

global.memoryStore = global.memoryStore || {};
const memoryStore = global.memoryStore;

export async function readData(filename) {
  if (process.env.VERCEL) {
    if (memoryStore[filename]) return [...memoryStore[filename]];
    try {
      const originalPath = path.join(process.cwd(), "data", filename);
      const fileData = await fs.readFile(originalPath, "utf-8");
      memoryStore[filename] = JSON.parse(fileData);
      return [...memoryStore[filename]];
    } catch (e) {
      memoryStore[filename] = [];
      return [];
    }
  }
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    const fileData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (e) {
    return [];
  }
}

export async function writeData(filename, data) {
  if (process.env.VERCEL) {
    memoryStore[filename] = JSON.parse(JSON.stringify(data));
    return true;
  }
  const filePath = path.join(process.cwd(), "data", filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  return true;
}
