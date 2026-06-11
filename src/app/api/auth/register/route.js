import { NextResponse } from "next/server";
import crypto from "crypto";
import { readData, writeData } from "@/lib/data-helper";

export async function POST(req) {
  try {
    const { name, email, phone, password } = await req.json();
    if (!name || !email || !phone || !password)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    let users = await readData("users.json");
    if (users.find(u => u.email === email))
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

    const newUser = { id: crypto.randomUUID(), name, email, phone, salt, hash, role: "user", createdAt: new Date().toISOString() };
    users.push(newUser);
    await writeData("users.json", users);

    return NextResponse.json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
