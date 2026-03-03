import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/Order";
import Product from "@/models/Product";

connect();

export async function POST(request) {
  try {
    const {
      customer, address, items,
      subtotal, deliveryFee, total,
      paymentMethod, notes,
    } = await request.json();

    if (!customer?.fullName || !customer?.email) {
      return NextResponse.json({ error: "Customer name and email are required." }, { status: 400 });
    }
    if (!address?.street || !address?.city) {
      return NextResponse.json({ error: "Delivery address is required." }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const productIds = items.map((i) => i.productId).filter(Boolean);

    const productDocs = await Product.find({ _id: { $in: productIds } })
      .select("_id name shopkeeper shopName stock instock")
      .lean();

    const productMap = {};
    productDocs.forEach((p) => { productMap[p._id.toString()] = p; });

    for (const item of items) {
      const p = productMap[item.productId];
      if (!p) {
        return NextResponse.json({ error: `Product not found: ${item.name || item.productId}` }, { status: 404 });
      }
      if (!p.instock || p.stock < item.quantity) {
        return NextResponse.json({ error: `"${p.name}" is out of stock or has insufficient quantity.` }, { status: 400 });
      }
    }

    const groups = {};
    items.forEach((item) => {
      const info  = productMap[item.productId] || null;
      const key   = info?.shopkeeper?.toString() || "unassigned";
      if (!groups[key]) {
        groups[key] = { shopkeeper: info?.shopkeeper || null, shopName: info?.shopName || null, items: [] };
      }
      groups[key].items.push(item);
    });

    const DELIVERY_FEE_THRESHOLD = 2000;
    const DELIVERY_FEE_AMOUNT    = 150;

    const createdOrders = await Promise.all(
      Object.values(groups).map(async (group) => {
        const groupSubtotal  = group.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const groupDeliveryFee = groupSubtotal >= DELIVERY_FEE_THRESHOLD ? 0 : DELIVERY_FEE_AMOUNT;
        return Order.create({
          customer, address,
          items:         group.items,
          subtotal:      groupSubtotal,
          deliveryFee:   groupDeliveryFee,
          total:         groupSubtotal + groupDeliveryFee,
          paymentMethod: paymentMethod || "cod",
          notes,
          shopkeeper:    group.shopkeeper,
          shopName:      group.shopName,
        });
      })
    );

    await Promise.all(
      items.map(async (item) => {
        const p = productMap[item.productId];
        if (!p) return;
        const newStock = p.stock - item.quantity;
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
          ...(newStock <= 0 ? { instock: false } : {}),
        });
      })
    );

    return NextResponse.json(
      {
        success:    true,
        message:    createdOrders.length > 1
          ? `Order split into ${createdOrders.length} shop orders and placed successfully.`
          : "Order placed successfully.",
        orderId:    createdOrders[0]._id,
        orderIds:   createdOrders.map((o) => o._id),
        orderCount: createdOrders.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Checkout POST error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { orderId, status } = await request.json();
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ message: "Order updated.", order });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}