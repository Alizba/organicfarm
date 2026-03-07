import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connect();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}