
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name:      { type: String, required: true },
  image:     { type: String },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  weight:    { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      email:    { type: String, required: true },
      phone:    { type: String },
    },

    address: {
      street:   { type: String, required: true },
      city:     { type: String, required: true },
      province: { type: String },
      zip:      { type: String },
    },

    items: [orderItemSchema],

    subtotal:    { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total:       { type: Number, required: true },

    shopkeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    shopName: { type: String, default: null },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "card", "online"],
      default: "cod",
    },

    isPaid:  { type: Boolean, default: false },
    notes:   { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);