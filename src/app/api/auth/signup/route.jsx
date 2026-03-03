// app/api/auth/signup/route.jsx
// Customer self-registration — creates a user with role: "user"
// Shopkeeper accounts are created separately via admin approval flow

import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Check duplicates
    const existing = await User.findOne({
      $or: [{ email }, { userName: username }],
    });

    if (existing) {
      if (existing.email === email) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "This username is already taken." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      userName:   username,
      email,
      password:   hashedPassword,
      role:       "user",       // ✅ always "user" for self-signup
      isVerified: true,         // skip email verification for now
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id:       newUser._id,
          userName: newUser.userName,
          email:    newUser.email,
          role:     newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}