import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");  

    const query = { instock: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" }; 
    }

    const products = await Product.find(query)
      .select("-__v") 
      .sort({ createdAt: -1 }); 

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Shop products fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}