import { NextResponse } from "next/server";
import crypto from "crypto";
import { readData } from "@/lib/data-helper";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    if (email === "athixsports@gmail.com" && password === "Roochir@05")
      return NextResponse.json({ success: true, user: { id: "admin-0", name: "ATHIX Admin", email: "athixsports@gmail.com", role: "admin" } });

    const users = await readData("users.json");
    const user = users.find(u => u.email === email);
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const checkHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, "sha512").toString("hex");
    if (user.hash !== checkHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}
