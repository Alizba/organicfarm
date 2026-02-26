import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Order from "@/models/Order";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connect();
    const userId = await getDataFromToken(request);

    const user = await User.findById(userId);
    if (!user || user.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const orders = await Order.find({ shopkeeper: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("shopkeeper/orders GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connect();
    const userId = await getDataFromToken(request);

    const user = await User.findById(userId);
    if (!user || user.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { orderId, status } = await request.json();
    const allowed = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

    if (!orderId || !allowed.includes(status)) {
      return NextResponse.json({ error: "Valid orderId and status required." }, { status: 400 });
    }
    const order = await Order.findOne({ _id: orderId, shopkeeper: userId });
    if (!order) {
      return NextResponse.json({ error: "Order not found or not yours." }, { status: 404 });
    }

    order.status = status;
    await order.save();

    return NextResponse.json({ message: "Order updated.", order });
  } catch (error) {
    console.error("shopkeeper/orders PATCH error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}