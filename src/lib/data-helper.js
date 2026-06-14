import fs from "fs/promises";
import path from "path";
import clientPromise from "./db-connect";

global.memoryStore = global.memoryStore || {};
const memoryStore = global.memoryStore;

function getCollectionName(filename) {
  return filename.replace(".json", "");
}

export async function readData(filename) {
  // 1. Try MongoDB if MONGODB_URI is provided
  if (process.env.MONGODB_URI && clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db("athixsports");
      const collection = db.collection(getCollectionName(filename));
      const items = await collection.find({}).toArray();
      return items.map(item => {
        const { _id, ...rest } = item;
        return rest;
      });
    } catch (e) {
      console.error("MongoDB read error:", e);
    }
  }

  // 2. Vercel memoryStore fallback if no MongoDB
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

  // 3. Local JSON files
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    const fileData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (e) {
    return [];
  }
}

export async function writeData(filename, data) {
  // 1. Try MongoDB if MONGODB_URI is provided
  if (process.env.MONGODB_URI && clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db("athixsports");
      const collection = db.collection(getCollectionName(filename));
      await collection.deleteMany({});
      if (data && data.length > 0) {
        await collection.insertMany(data);
      }
      return true;
    } catch (e) {
      console.error("MongoDB write error:", e);
    }
  }

  // 2. Vercel memoryStore fallback if no MongoDB
  if (process.env.VERCEL) {
    memoryStore[filename] = JSON.parse(JSON.stringify(data));
    return true;
  }

  // 3. Local JSON files
  const filePath = path.join(process.cwd(), "data", filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  return true;
}
