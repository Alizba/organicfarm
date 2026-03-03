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

    const shopRequest = await ShopRequest.findOne({ email }).sort({
      createdAt: -1,
    });

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
    }

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

    const tokenData = {
      id:          user._id,
      email:       user.email,
      userName:    user.userName, 
      role:        user.role,        
      shopName:    user.shopName || null,   
      shopDescription: user.shopDescription || null, 
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });

    const redirectMap = {
      admin:      "/roles/admin",
      shopkeeper: "/roles/shopkeeper",
      user:       "/",
    };
    const redirectTo = redirectMap[user.role] || "/";

    const response = NextResponse.json({
      message:    "Login successful",
      success:    true,
      role:       user.role,
      userName:   user.userName,
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