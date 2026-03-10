import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Partner from "@/models/Partner";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const partners = await Partner.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, partners });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { name, image, order } = await request.json();
    if (!name || !image) {
      return NextResponse.json({ error: "Name and image are required" }, { status: 400 });
    }
    const partner = await Partner.create({ name, image, order: order ?? 0 });
    return NextResponse.json({ success: true, partner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await Partner.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}