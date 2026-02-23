import { NextResponse } from "next/server";
import ShopRequest from "@/models/ShopRequest";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request) {
  try {
    const userId = await getDataFromToken(request);

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "user") {
      return NextResponse.json(
        { error: "Only regular users can apply to become a shopkeeper" },
        { status: 403 }
      );
    }

    const { shopName, shopDescription } = await request.json();

    if (!shopName) {
      return NextResponse.json({ error: "Shop name is required" }, { status: 400 });
    }

    const existingRequest = await ShopRequest.findOne({
      user: userId,
      status: "pending",
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending request" },
        { status: 400 }
      );
    }

    const newRequest = new ShopRequest({ user: userId, shopName, shopDescription });
    await newRequest.save();

    return NextResponse.json({ message: "Shop request submitted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const userId = await getDataFromToken(request);

    const shopRequest = await ShopRequest.findOne({ user: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ shopRequest: shopRequest || null });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}