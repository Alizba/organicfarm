import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
  try {
    const tokenData = getDataFromToken(request); 

    const user = await User.findById(tokenData.id).select(
      "-password -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id:              user._id,
        userName:        user.userName,
        email:           user.email,
        role:            user.role,
        isVerified:      user.isVerified,
        isAdmin:         user.isAdmin,
        shopName:        user.shopName || null,        
        shopDescription: user.shopDescription || null, 
        phone:           user.phone || null,         
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}