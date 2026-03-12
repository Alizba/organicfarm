import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const category   = searchParams.get("category");
    const shopkeeper = searchParams.get("shopkeeper");

    const query = {};
    if (category)   query.category   = category;
    if (shopkeeper) query.shopkeeper = shopkeeper;

    const products = await Product.find(query)
      .populate("category", "name label icon")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}