import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Partner from "@/models/Partner";

export async function GET() {
  try {
    await connect();
    const partners = await Partner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, partners });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}