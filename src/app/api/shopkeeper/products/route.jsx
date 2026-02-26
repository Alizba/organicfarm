import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Product from "@/models/Product";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

// GET — fetch all products for the logged-in shopkeeper
export async function GET(request) {
  try {
    await connect();
    const userId = await getDataFromToken(request);
    const products = await Product.find({ shopkeeper: userId }).sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("shopkeeper/products GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create a new product
export async function POST(request) {
  try {
    await connect();
    const userId = await getDataFromToken(request);

    const user = await User.findById(userId);
    if (!user || user.role !== "shopkeeper") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { name, price, description, category, stock, image } = await request.json();

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and price are required." }, { status: 400 });
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      stock: stock || 0,
      image,
      shopkeeper: userId,
      shopName: user.userName, // store shopkeeper's username as shopName
    });

    return NextResponse.json({ message: "Product created.", product }, { status: 201 });
  } catch (error) {
    console.error("shopkeeper/products POST error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — delete a product by id (?id=...)
export async function DELETE(request) {
  try {
    await connect();
    const userId = await getDataFromToken(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Product id is required." }, { status: 400 });

    const product = await Product.findOne({ _id: id, shopkeeper: userId });
    if (!product) {
      return NextResponse.json({ error: "Product not found or not yours." }, { status: 404 });
    }

    await product.deleteOne();
    return NextResponse.json({ message: "Product deleted." });
  } catch (error) {
    console.error("shopkeeper/products DELETE error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update a product
export async function PATCH(request) {
  try {
    await connect();
    const userId = await getDataFromToken(request);

    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "Product id is required." }, { status: 400 });

    const product = await Product.findOne({ _id: id, shopkeeper: userId });
    if (!product) {
      return NextResponse.json({ error: "Product not found or not yours." }, { status: 404 });
    }

    Object.assign(product, updates);
    await product.save();

    return NextResponse.json({ message: "Product updated.", product });
  } catch (error) {
    console.error("shopkeeper/products PATCH error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}