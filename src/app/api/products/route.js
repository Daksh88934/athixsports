import { NextResponse } from "next/server";
import { readData } from "@/lib/data-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await readData("products.json");
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
