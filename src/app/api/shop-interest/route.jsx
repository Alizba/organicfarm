
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import ShopInterest from "@/models/ShopInterest";

connect();

export async function POST(request) {
  try {
    const { fullName, email, phone, shopName, shopDescription } = await request.json();

    if (!fullName || !email || !shopName) {
      return NextResponse.json(
        { error: "Name, email and shop name are required" },
        { status: 400 }
      );
    }

    const existing = await ShopInterest.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted an interest request with this email." },
        { status: 409 }
      );
    }

    const interest = await ShopInterest.create({
      fullName,
      email,
      phone,
      shopName,
      shopDescription,
    });

    return NextResponse.json(
      { message: "Request submitted successfully!", success: true, id: interest._id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const filter = status ? { status } : {};

    const interests = await ShopInterest.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ interests });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status, adminNotes } = await request.json();

    const interest = await ShopInterest.findByIdAndUpdate(
      id,
      { status, ...(adminNotes && { adminNotes }) },
      { new: true }
    );

    if (!interest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully", interest });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}