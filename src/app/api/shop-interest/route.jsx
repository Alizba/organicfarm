import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";
import ShopRequest from "@/models/ShopRequest";
import User from "@/models/userModel";

export async function POST(request) {
  try {
    await connect();

    const { fullName, userName, email, phone, password, shopName, shopDescription } =
      await request.json();

    // --- Validation ---
    if (!fullName || !userName || !email || !password || !shopName) {
      return NextResponse.json(
        { error: "fullName, userName, email, password, and shopName are required." },
        { status: 400 }
      );
    }

    // Check if email or userName already exists in Users (already approved before)
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email or username already exists." },
        { status: 409 }
      );
    }

    // Check if a pending/approved request already exists for this email
    const existingRequest = await ShopRequest.findOne({
      email,
      status: { $in: ["pending", "approved"] },
    });
    if (existingRequest) {
      return NextResponse.json(
        { error: "A request with this email is already pending or approved." },
        { status: 409 }
      );
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 12);

    const shopRequest = await ShopRequest.create({
      fullName,
      userName,
      email,
      phone,
      password: hashedPassword,
      shopName,
      shopDescription,
    });

    return NextResponse.json(
      { message: "Request submitted successfully.", id: shopRequest._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("shop-interest POST error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}