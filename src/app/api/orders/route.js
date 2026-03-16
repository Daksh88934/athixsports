import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

export async function POST(req) {
  try {
    const orderData = await req.json();
    
    let orders = [];
    try {
      const fileData = await fs.readFile(ordersFilePath, "utf-8");
      orders = JSON.parse(fileData);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }

    const newOrder = {
      id: "ORD-" + crypto.randomBytes(4).toString('hex').toUpperCase(),
      createdAt: new Date().toISOString(),
      status: "Pending",
      ...orderData
    };

    orders.unshift(newOrder); // Add to beginning
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));

    return NextResponse.json({ success: true, orderId: newOrder.id });

  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
