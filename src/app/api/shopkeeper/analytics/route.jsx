import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request) {
  try {
    await connect();

    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopkeeperId = tokenData.id;

    const products = await Product.find({ shopkeeper: shopkeeperId });
    const productIds = products.map((p) => p._id);

    const orders = await Order.find({
      "items.productId": { $in: productIds },
    });

    let totalRevenue = 0;
    let totalItemsSold = 0;
    const productSales = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const pid = item.productId?.toString();
        if (productIds.map((id) => id.toString()).includes(pid)) {
          const revenue = item.price * item.quantity;
          totalRevenue += revenue;
          totalItemsSold += item.quantity;
          if (!productSales[pid]) {
            productSales[pid] = { name: item.name, qty: 0, revenue: 0 };
          }
          productSales[pid].qty += item.quantity;
          productSales[pid].revenue += revenue;
        }
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalItemsSold,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        topProducts,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}