import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data-helper";

// Simple in-memory OTP store for simplicity
global.otpStore = global.otpStore || {};

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const users = await readData("users.json");
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // We also support the default admin password change for testing
    if (email.toLowerCase() !== "admin@gmail.com" && !user) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in global store (expires in 10 minutes)
    global.otpStore[email.toLowerCase()] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    console.log(`\n==========================================\n[RESET OTP FOR ${email}]: ${otp}\n==========================================\n`);

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully! Check server logs. (For testing, OTP has been logged to terminal)",
      otp // Send OTP in response too to make it easy for testing without opening console!
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Failed to initiate reset process" }, { status: 500 });
  }
}
