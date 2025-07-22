import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log('Upload route hit!');
    return NextResponse.json({ message: "Upload route working" });
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json({ message: "Failed to upload document" }, { status: 500 });
  }
} 