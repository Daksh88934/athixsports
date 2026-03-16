import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Define the path to our local JSON database
const dataFilePath = path.join(process.cwd(), "data", "submissions.json");

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Validate basic inputs
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSubmission = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...data
    };

    let submissions = [];

    // Ensure the data directory and file exist, then read them
    try {
      const fileContent = await fs.readFile(dataFilePath, "utf-8");
      submissions = JSON.parse(fileContent);
    } catch (error) {
      // If the file doesn't exist, we'll start with an empty array
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    // Add new sumbission and write back to file
    submissions.push(newSubmission);
    await fs.writeFile(dataFilePath, JSON.stringify(submissions, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: "Message received! We will get back to you shortly." 
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
