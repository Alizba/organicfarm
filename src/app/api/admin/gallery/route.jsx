import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Gallery from "@/models/Gallery";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request) {
  try {
    await connect();
    const items = await Gallery.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, image, description, category } = body;
    if (!title || !image)
      return NextResponse.json({ error: "Title and image are required" }, { status: 400 });

    const item = await Gallery.create({ title, image, description, category, uploadedBy: tokenData.id });
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Gallery.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}