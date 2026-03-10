import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/Order";
import Product from "@/models/Product";
import mongoose from "mongoose";

connect();

export async function GET() {
  try {
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id:          "$items.productId",
          totalSold:    { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          name:         { $first: "$items.name" },
          price:        { $first: "$items.price" },
          image:        { $first: "$items.image" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 20 },
    ]);

    const validProducts = topProducts.filter((p) =>
      p._id && mongoose.Types.ObjectId.isValid(p._id)
    ).slice(0, 10);

    const productIds = validProducts.map((p) => p._id);

    const liveDocs = await Product.find({ _id: { $in: productIds } })
      .populate("category", "name label icon")
      .select("name price originalPrice image instock stock category shopName")
      .lean();

    const liveMap = {};
    liveDocs.forEach((p) => { liveMap[p._id.toString()] = p; });

    const result = validProducts.map((p, idx) => {
      const live = liveMap[p._id?.toString()] || {};
      return {
        _id:           p._id,
        rank:          idx + 1,
        name:          live.name          || p.name,
        image:         live.image         || p.image,
        price:         live.price         || p.price,
        originalPrice: live.originalPrice || null,
        instock:       live.instock       ?? true,
        stock:         live.stock         ?? 0,
        shopName:      live.shopName      || null,
        category:      live.category      || null,
        totalSold:     p.totalSold,
        totalRevenue:  p.totalRevenue,
      };
    });

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error("Top selling error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}