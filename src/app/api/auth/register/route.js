import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

export async function POST(req) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    let users = [];
    try {
      const fileData = await fs.readFile(usersFilePath, "utf-8");
      users = JSON.parse(fileData);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }

    if (users.find(u => u.email === email)) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    // Hash the password securely with crypto
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      salt,
      hash,
      role: "user", // Default role
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ success: true, message: "User registered successfully." });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
