import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Blog from "@/models/Blog";
import { getDataFromToken } from "@/helpers/getDataFromToken";

function makeSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
}

export async function GET(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const posts = await Blog.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, posts });
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
    const { title, content, coverImage, category, tags, published } = body;
    if (!title || !content)
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });

    const post = await Blog.create({
      title, content, coverImage, category,
      tags: tags || [],
      published: published ?? false,
      slug: makeSlug(title),
      authorName: tokenData.userName || "Admin",
      authorId:   tokenData.id,
      authorRole: "admin",
    });
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, ...updates } = body;
    const post = await Blog.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, post });
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
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}