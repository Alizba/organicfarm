import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Gallery from "@/models/Gallery";

export async function GET() {
  try {
    await connect();
    const items = await Gallery.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}