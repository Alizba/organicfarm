import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import ShopRequest from "@/models/ShopRequest";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
  try {
    const userId = await getDataFromToken(request);
    const requester = await User.findById(userId);

    if (!requester || requester.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); 

    const filter = status ? { status } : {};
    const requests = await ShopRequest.find(filter)
      .populate("user", "userName email role")
      .sort({ createdAt: -1 });

    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const adminId = await getDataFromToken(request);
    const admin = await User.findById(adminId);

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { requestId, action } = await request.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const shopRequest = await ShopRequest.findById(requestId);
    if (!shopRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (shopRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Request already processed" },
        { status: 400 }
      );
    }

    shopRequest.status = action === "approve" ? "approved" : "rejected";
    await shopRequest.save();

    if (action === "approve") {
      await User.findByIdAndUpdate(shopRequest.user, {
        role: "shopkeeper",
        isAdmin: false,
      });
    }

    return NextResponse.json({
      message: `Request ${shopRequest.status}`,
      status: shopRequest.status,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}