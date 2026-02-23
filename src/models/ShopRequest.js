import mongoose from "mongoose";

const shopRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  shopDescription: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.models.ShopRequest ||
  mongoose.model("ShopRequest", shopRequestSchema);