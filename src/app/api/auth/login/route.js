import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Hardcoded Admin Credential Check
    if (email === "admin@gmail.com" && password === "athix") {
      return NextResponse.json({ 
        success: true, 
        user: { id: "admin-0", name: "ATHIX Admin", email: "admin@gmail.com", role: "admin" } 
      });
    }

    let users = [];
    try {
      const fileData = await fs.readFile(usersFilePath, "utf-8");
      users = JSON.parse(fileData);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify Password Hash
    const checkHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
    
    if (user.hash !== checkHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Return safe user object
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    return NextResponse.json({ success: true, user: safeUser });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}
