import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

export async function GET(req) {
  try {
    let users = [];
    try {
      const fileData = await fs.readFile(usersFilePath, "utf-8");
      users = JSON.parse(fileData);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }

    // Filter out password hashes and salts before sending to admin portal
    const safeUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt
    }));

    // Sort by created at, newest first
    safeUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ success: true, users: safeUsers });

  } catch (error) {
    console.error("Admin Users Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
