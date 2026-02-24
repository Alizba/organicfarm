
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/Order";

connect();

export async function POST(request) {
  try {
    const { customer, address, items, subtotal, deliveryFee, total, paymentMethod, notes } = await request.json();

    if (!customer?.fullName || !customer?.email) {
      return NextResponse.json({ error: "Customer name and email are required" }, { status: 400 });
    }
    if (!address?.street || !address?.city) {
      return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const order = await Order.create({
      customer, address, items,
      subtotal, deliveryFee: deliveryFee || 0, total,
      paymentMethod: paymentMethod || "cod",
      notes,
    });

    return NextResponse.json(
      { message: "Order placed successfully", orderId: order._id, success: true },
      { status: 201 }
    );
  } catch (error) {
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
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order updated", order });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}