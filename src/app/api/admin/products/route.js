import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data-helper";

export async function GET() {
  try {
    const products = await readData("products.json");
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, category, price, color, inStock, image, images, stock, description, design, fit, fabric, washCare } = body;
    if (!title || !price) return NextResponse.json({ error: "Title and price are required" }, { status: 400 });

    const products = await readData("products.json");
    const newProduct = {
      id: Date.now(),
      title,
      category: category || "Jerseys",
      price,
      color: color || "#ff6b00",
      inStock: inStock !== undefined ? inStock : true,
      image: image || (images && images[0]) || "",
      images: images || [image || "", "", "", "", ""],
      stock: parseInt(stock) || 0,
      description: description || "",
      design: design || "",
      fit: fit || "",
      fabric: fabric || "",
      washCare: washCare || "",
      sold: 0,
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    await writeData("products.json", products);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json({ error: "Failed to add product: " + error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const updated = await req.json();
    if (!updated.id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    let products = await readData("products.json");
    const idx = products.findIndex(p => p.id === updated.id);
    if (idx === -1) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    products[idx] = { ...products[idx], ...updated };
    await writeData("products.json", products);
    return NextResponse.json({ success: true, product: products[idx] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    let products = await readData("products.json");
    const before = products.length;
    products = products.filter(p => p.id !== id);
    if (products.length === before) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    await writeData("products.json", products);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
