import { NextResponse } from "next/server";
import crypto from "crypto";
import { readData, writeData } from "@/lib/data-helper";

export async function POST(req) {
  try {
    const orderData = await req.json();
    const orders = await readData("orders.json");
    const newOrder = {
      id: "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
      createdAt: new Date().toISOString(),
      status: "Pending",
      ...orderData
    };
    orders.unshift(newOrder);
    await writeData("orders.json", orders);
    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
