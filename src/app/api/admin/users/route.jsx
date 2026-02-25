import User from "@/models/userModel";
import ShopRequest from "@/models/ShopRequest";
import { connect } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

// GET — fetch all shop requests (for admin dashboard)
export async function GET() {
  await connect();

  const requests = await ShopRequest.find().sort({ createdAt: -1 });

  return NextResponse.json({ requests });
}

// PATCH — approve or reject a shop request
// Body: { requestId: string, action: "approved" | "rejected" }
export async function PATCH(request) {
  try {
    await connect();

    const { requestId, action } = await request.json();

    if (!requestId || !["approved", "rejected"].includes(action)) {
      return NextResponse.json(
        { error: "requestId and action ('approved' | 'rejected') are required." },
        { status: 400 }
      );
    }

    const shopRequest = await ShopRequest.findById(requestId);
    if (!shopRequest) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    if (shopRequest.status !== "pending") {
      return NextResponse.json(
        { error: "This request has already been processed." },
        { status: 409 }
      );
    }

    if (action === "rejected") {
      shopRequest.status = "rejected";
      await shopRequest.save();
      return NextResponse.json({ message: "Request rejected." });
    }

    // --- APPROVE: create the User account using stored (hashed) password ---

    // Guard against duplicate email/userName
    const existing = await User.findOne({
      $or: [{ email: shopRequest.email }, { userName: shopRequest.userName }],
    });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email or username already exists." },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      userName:   shopRequest.userName,
      email:      shopRequest.email,
      password:   shopRequest.password, // already hashed
      role:       "shopkeeper",
      isVerified: true,
    });

    shopRequest.status       = "approved";
    shopRequest.approvedUser = newUser._id;
    await shopRequest.save();

    return NextResponse.json({
      message: "Request approved. Shopkeeper account created.",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("admin/users PATCH error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}