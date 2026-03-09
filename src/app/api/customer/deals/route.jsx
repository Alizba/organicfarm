import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connect();

    
    const all = await Product.find({ instock: true })
      .populate("category", "name label icon")
      .lean()
      .sort({ createdAt: -1 });

    const deals = all.filter((p) => {
      if (!p.deal) return false;
      const deal = typeof p.deal === "string" ? JSON.parse(p.deal) : p.deal;
      return deal?.isOnDeal === true;
    }).map((p) => ({
      ...p,
      deal: typeof p.deal === "string" ? JSON.parse(p.deal) : p.deal,
    }));

    return NextResponse.json({ success: true, deals });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}