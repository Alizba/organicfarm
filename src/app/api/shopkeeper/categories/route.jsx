import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Category from "@/models/Category";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || !["shopkeeper", "admin"].includes(tokenData.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const categories = await Category.find({ isActive: true }).select("name label icon").sort({ name: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || !["shopkeeper", "admin"].includes(tokenData.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { name, label, icon, description, gradient } = await request.json();
    if (!name || !label) {
      return NextResponse.json({ error: "name and label are required." }, { status: 400 });
    }
    const existing = await Category.findOne({ name: name.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "Category already exists.", category: existing }, { status: 409 });
    }
    const category = await Category.create({
      name: name.toLowerCase().trim(), label,
      icon: icon || "🌿", description: description || "",
      gradient: gradient || "#e8f5e9,#c8e6c9",
    });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}