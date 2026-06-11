import { NextResponse } from "next/server";
import { readData } from "@/lib/data-helper";

export async function GET() {
  try {
    const users = await readData("users.json");
    const safeUsers = users.map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt }));
    safeUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
