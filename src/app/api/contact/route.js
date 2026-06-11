import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data-helper";

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.name || !data.email || !data.message)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    const submissions = await readData("submissions.json");
    submissions.push({ id: Date.now().toString(), createdAt: new Date().toISOString(), ...data });
    await writeData("submissions.json", submissions);
    return NextResponse.json({ success: true, message: "Message received! We will get back to you shortly." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
  }
}
