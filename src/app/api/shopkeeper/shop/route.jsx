import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import ShopRequest from "@/models/ShopRequest";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

// GET — fetch this shopkeeper's shop info from ShopRequest
export async function GET(request) {
  try {
    await connect();
    const userId = await getDataFromToken(request);

    const user = await User.findById(userId);
    if (!user || user.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    // Find the approved ShopRequest that matches this user's email
    const shop = await ShopRequest.findOne({
      email:  user.email,
      status: "approved",
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found." }, { status: 404 });
    }

    return NextResponse.json({ shop });
  } catch (error) {
    console.error("shopkeeper/shop GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update shopName, shopDescription, phone on their ShopRequest record
export async function PATCH(request) {
  try {
    await connect();
    const userId = await getDataFromToken(request);

    const user = await User.findById(userId);
    if (!user || user.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { shopName, shopDescription, phone } = await request.json();

    if (!shopName) {
      return NextResponse.json({ error: "Shop name is required." }, { status: 400 });
    }

    const shop = await ShopRequest.findOneAndUpdate(
      { email: user.email, status: "approved" },
      { shopName, shopDescription, phone },
      { new: true }
    );

    if (!shop) {
      return NextResponse.json({ error: "Shop not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Shop updated.", shop });
  } catch (error) {
    console.error("shopkeeper/shop PATCH error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}