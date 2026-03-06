import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import ContactMessage from "@/models/ContactMessage";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request) {
  try {
    await connect();
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const msg = await ContactMessage.create({ name, email, subject, message });

    return NextResponse.json({ success: true, message: "Message received!", id: msg._id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connect();

    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connect();

    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    await ContactMessage.findByIdAndUpdate(id, { isRead: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}