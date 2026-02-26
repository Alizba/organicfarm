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
      .select("_id shopkeeper shopName")
      .lean();

    const productMap = {};
    productDocs.forEach((p) => {
      productMap[p._id.toString()] = {
        shopkeeper: p.shopkeeper,
        shopName:   p.shopName,
      };
    });

    
    const groups = {};   

    items.forEach((item) => {
      const info   = productMap[item.productId] || null;
      const key    = info?.shopkeeper?.toString() || "unassigned";
      const sName  = info?.shopName || null;

      if (!groups[key]) {
        groups[key] = {
          shopkeeper: info?.shopkeeper || null,
          shopName:   sName,
          items:      [],
        };
      }
      groups[key].items.push(item);
    });

    const groupList = Object.values(groups);

    const DELIVERY_FEE_THRESHOLD = 2000;
    const DELIVERY_FEE_AMOUNT    = 150;

    const createdOrders = await Promise.all(
      groupList.map(async (group) => {
        const groupSubtotal = group.items.reduce(
          (sum, i) => sum + i.price * i.quantity, 0
        );
        const groupDeliveryFee = groupSubtotal >= DELIVERY_FEE_THRESHOLD ? 0 : DELIVERY_FEE_AMOUNT;
        const groupTotal       = groupSubtotal + groupDeliveryFee;

        const order = await Order.create({
          customer,
          address,
          items:         group.items,
          subtotal:      groupSubtotal,
          deliveryFee:   groupDeliveryFee,
          total:         groupTotal,
          paymentMethod: paymentMethod || "cod",
          notes,
          shopkeeper:    group.shopkeeper,   
          shopName:      group.shopName,    
        });

        return order;
      })
    );

    return NextResponse.json(
      {
        message:   createdOrders.length > 1
          ? `Order split into ${createdOrders.length} shop orders and placed successfully.`
          : "Order placed successfully.",
        orderIds:  createdOrders.map((o) => o._id),
        orderId:   createdOrders[0]._id,   
        orderCount: createdOrders.length,
        success:   true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("checkout POST error:", error.message);
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
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Order updated.", order });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}