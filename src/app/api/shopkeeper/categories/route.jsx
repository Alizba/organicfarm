import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/Product";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || !["shopkeeper", "admin"].includes(tokenData.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await Product.distinct("category");

    const cleaned = categories
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ success: true, categories: cleaned });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}