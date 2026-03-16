import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const productsFilePath = path.join(process.cwd(), "data", "products.json");

async function getProducts() {
  try {
    const fileData = await fs.readFile(productsFilePath, "utf-8");
    return JSON.parse(fileData);
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

async function saveProducts(products) {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
}

// Add new product
export async function POST(req) {
  try {
    const newProduct = await req.json();
    const products = await getProducts();
    
    const product = {
      id: Date.now(),
      ...newProduct,
      inStock: newProduct.inStock !== undefined ? newProduct.inStock : true
    };
    
    products.push(product);
    await saveProducts(products);
    
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

// Update existing product
export async function PUT(req) {
  try {
    const updatedProduct = await req.json();
    const products = await getProducts();
    
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    products[index] = { ...products[index], ...updatedProduct };
    await saveProducts(products);
    
    return NextResponse.json({ success: true, product: products[index] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// Delete product
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id"));
    
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    
    let products = await getProducts();
    products = products.filter(p => p.id !== id);
    
    await saveProducts(products);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
