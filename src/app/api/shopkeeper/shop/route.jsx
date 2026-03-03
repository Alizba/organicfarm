import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import ShopRequest from "@/models/ShopRequest";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connect();

    const tokenData = getDataFromToken(request);

    const user = await User.findById(tokenData.id);
    if (!user || user.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const shopRequest = await ShopRequest.findOne({
      email:  user.email,
      status: "approved",
    });

    const shop = {
      shopName:        user.shopName        || shopRequest?.shopName        || null,
      shopDescription: user.shopDescription || shopRequest?.shopDescription || null,
      phone:           user.phone           || shopRequest?.phone           || null,
      email:           user.email,
      status:          "approved",
      createdAt:       user.createdAt,
    };

    return NextResponse.json({ shop });
  } catch (error) {
    console.error("shopkeeper/shop GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connect();

    const tokenData = getDataFromToken(request);

    const user = await User.findById(tokenData.id);
    if (!user || user.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { shopName, shopDescription, phone } = await request.json();

    if (!shopName) {
      return NextResponse.json({ error: "Shop name is required." }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      tokenData.id,
      { shopName, shopDescription, phone },
      { new: true }
    );

    await ShopRequest.findOneAndUpdate(
      { email: user.email, status: "approved" },
      { shopName, shopDescription, phone }
    );

    const shop = {
      shopName:        updatedUser.shopName,
      shopDescription: updatedUser.shopDescription,
      phone:           updatedUser.phone,
      email:           updatedUser.email,
      status:          "approved",
      createdAt:       updatedUser.createdAt,
    };

    return NextResponse.json({ message: "Shop updated.", shop });
  } catch (error) {
    console.error("shopkeeper/shop PATCH error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}