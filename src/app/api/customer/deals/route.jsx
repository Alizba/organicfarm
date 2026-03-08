import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connect();
    const deals = await Product.find({ "deal.isOnDeal": true, instock: true })
      .populate("category", "name label icon")
      .select("-__v")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, deals });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}