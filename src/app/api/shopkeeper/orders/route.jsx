import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/Order";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request) {
  try {
    await connect();

    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ shopkeeper: tokenData.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("shopkeeper/orders GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}