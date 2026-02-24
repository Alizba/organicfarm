import mongoose from "mongoose";

const shopInterestSchema = new mongoose.Schema(
  {
    fullName:        { type: String, required: [true, "Name is required"] },
    email:           { type: String, required: [true, "Email is required"] },
    phone:           { type: String },
    shopName:        { type: String, required: [true, "Shop name is required"] },
    shopDescription: { type: String },
    status: {
      type: String,
      enum: ["new", "contacted", "approved", "rejected"],
      default: "new",
    },
    adminNotes: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.models.ShopInterest ||
  mongoose.model("ShopInterest", shopInterestSchema);