import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/Product";

export async function GET(request, context) {
  try {
    await connect();
    const { id } = await context.params;
    const product = await Product.findById(id)
      .populate("category", "name label icon")
      .lean();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}