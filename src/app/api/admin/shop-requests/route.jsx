
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import ShopRequest from "@/models/ShopRequest";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request) {
  try {
    await connect();

    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = status ? { status } : {};
    const requests = await ShopRequest.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connect();

    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id");

    const { action, rejectionReason } = await request.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    const shopRequest = await ShopRequest.findById(requestId);
    if (!shopRequest) {
      return NextResponse.json(
        { error: "Shop request not found" },
        { status: 404 }
      );
    }

    if (shopRequest.status !== "pending") {
      return NextResponse.json(
        { error: "This request has already been processed" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const existingUser = await User.findOne({
        $or: [
          { email: shopRequest.email },
          { userName: shopRequest.userName },
        ],
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "A user with this email or username already exists" },
          { status: 409 }
        );
      }

      const newUser = await User.create({
        userName: shopRequest.userName,
        email: shopRequest.email,
        password: shopRequest.password,
        role: "shopkeeper",
        isVerified: true,
        shopName: shopRequest.shopName,
        shopDescription: shopRequest.shopDescription,
        phone: shopRequest.phone,
      });

      shopRequest.status = "approved";
      shopRequest.approvedUser = newUser._id;
      await shopRequest.save();

      return NextResponse.json({
        success: true,
        message: `Shopkeeper account created for ${newUser.userName}`,
        userId: newUser._id,
      });
    }

    if (action === "reject") {
      shopRequest.status = "rejected";
      shopRequest.rejectionReason = rejectionReason || null;
      await shopRequest.save();

      return NextResponse.json({
        success: true,
        message: "Shop request rejected",
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}