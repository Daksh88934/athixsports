import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await readData("orders.json");
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, status } = await req.json();
    const orders = await readData("orders.json");
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      await writeData("orders.json", orders);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
