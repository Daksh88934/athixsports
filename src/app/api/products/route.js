import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const productsFilePath = path.join(process.cwd(), "data", "products.json");

export async function GET() {
  try {
    let products = [];
    try {
      const fileData = await fs.readFile(productsFilePath, "utf-8");
      products = JSON.parse(fileData);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
