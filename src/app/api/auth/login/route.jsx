import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import ShopRequest from "@/models/ShopRequest";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ── Check if this email has a shop request that is pending or rejected ──
    // This runs BEFORE looking up the User, because pending/rejected applicants
    // have no User document yet — they submitted a ShopRequest only.
    const shopRequest = await ShopRequest.findOne({ email }).sort({ createdAt: -1 });

    if (shopRequest) {
      if (shopRequest.status === "pending") {
        return NextResponse.json(
          {
            error:
              "Your seller application is still under review. You'll be able to log in once an admin approves it.",
          },
          { status: 403 }
        );
      }

      if (shopRequest.status === "rejected") {
        return NextResponse.json(
          {
            error:
              "Your seller application was not approved. Please contact support for more information.",
          },
          { status: 403 }
        );
      }

      // status === "approved" → a User was created, fall through to normal login
    }

    // ── Normal login flow ───────────────────────────────────────────────────
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // // ── Check email verified ─────────────────────────────────────────────
    // if (!user.isVerified) {
    //   return NextResponse.json(
    //     { error: "Please verify your email before logging in" },
    //     { status: 403 }
    //   );
    // }

    const tokenData = {
      id:    user._id,
      email: user.email,
      role:  user.role,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });

    const redirectMap = {
      admin:      "/roles/admin",
      shopkeeper: "/roles/shopkeeper",
      user:       "/roles/user",
    };
    const redirectTo = redirectMap[user.role] || "/roles/user";

    const response = NextResponse.json({
      message:    "Login successful",
      success:    true,
      role:       user.role,
      redirectTo,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   7 * 24 * 60 * 60,
      path:     "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}