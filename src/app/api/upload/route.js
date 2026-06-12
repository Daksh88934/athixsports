import { NextResponse } from "next/server";
import { writeData, readData } from "@/lib/data-helper";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const productId = formData.get("productId");

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique name and path in public/uploads
    const ext = file.name ? path.extname(file.name) : ".jpg";
    const filename = `${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    const imageUrl = `/uploads/${filename}`;

    // If productId given, update that product's image
    if (productId) {
      const products = await readData("products.json");
      const idx = products.findIndex(p => p.id === parseInt(productId));
      if (idx !== -1) {
        products[idx].image = imageUrl;
        await writeData("products.json", products);
      }
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}
