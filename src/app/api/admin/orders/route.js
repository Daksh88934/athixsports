import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

export async function GET() {
  try {
    let orders = [];
    try {
      const fileData = await fs.readFile(ordersFilePath, "utf-8");
      orders = JSON.parse(fileData);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin Orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, status } = await req.json();
    
    let orders = [];
    try {
      const fileData = await fs.readFile(ordersFilePath, "utf-8");
      orders = JSON.parse(fileData);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }

    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
