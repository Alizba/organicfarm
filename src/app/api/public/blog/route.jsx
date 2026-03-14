import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Blog from "@/models/Blog";

export async function GET(request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const slug     = searchParams.get("slug");
    const category = searchParams.get("category");

    if (slug) {
      const post = await Blog.findOne({ slug, published: true }).lean();
      if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
      return NextResponse.json({ success: true, post });
    }

    const query = { published: true };
    if (category) query.category = category;
    const posts = await Blog.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}