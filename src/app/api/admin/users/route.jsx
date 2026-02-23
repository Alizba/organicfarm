import User from "@/models/User";
import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const users = await User.find();

  return NextResponse.json({ users });
}