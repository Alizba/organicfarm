import mongoose from "mongoose";

const shopRequestSchema = new mongoose.Schema(
  {
    // Applicant info
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },

    password: { type: String, required: true },

    shopName: { type: String, required: true },
    shopDescription: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: { type: String, default: null }, 

    approvedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ShopRequest ||
  mongoose.model("ShopRequest", shopRequestSchema);