import { NextResponse } from "next/server";
import { writeData, readData } from "@/lib/data-helper";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const productId = formData.get("productId");

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // If productId given, update that product's image
    if (productId) {
      const products = await readData("products.json");
      const idx = products.findIndex(p => p.id === parseInt(productId));
      if (idx !== -1) {
        products[idx].image = dataUrl;
        await writeData("products.json", products);
      }
    }

    return NextResponse.json({ success: true, imageUrl: dataUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}
