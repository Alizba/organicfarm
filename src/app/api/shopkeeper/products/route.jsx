import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/Product";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await Product.find({ shopkeeper: tokenData.id })
      .populate("category", "name label icon")
      .sort({ createdAt: -1 })
      .lean();

    const normalized = products.map((p) => ({
      ...p,
      deal: p.deal && typeof p.deal.isOnDeal === "boolean"
        ? p.deal
        : { isOnDeal: false, dealLabel: "Deal of the Day", dealEndsAt: null },
    }));

    return NextResponse.json({ success: true, products: normalized });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { name, price, originalPrice, description, category, weight, stock, instock, isVegetarian, image, deal } = body;
    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }
    const product = await Product.create({
      name, price, originalPrice, description, category,
      weight, stock: stock ?? 0, instock: instock ?? true,
      isVegetarian: isVegetarian ?? false, image,
      shopkeeper: tokenData.id,
      shopName:   tokenData.shopName,
      deal: {
        isOnDeal:   deal?.isOnDeal   ?? false,
        dealLabel:  deal?.dealLabel  || "Deal of the Day",
        dealEndsAt: deal?.dealEndsAt || null,
      },
    });
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");
    if (!productId) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    const existing = await Product.findOne({ _id: productId, shopkeeper: tokenData.id });
    if (!existing) return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 });
    const body = await request.json();
    const updated = await Product.findByIdAndUpdate(productId, body, { new: true, runValidators: true });
    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connect();
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");
    const existing = await Product.findOne({ _id: productId, shopkeeper: tokenData.id });
    if (!existing) return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 });
    await Product.findByIdAndDelete(productId);
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}