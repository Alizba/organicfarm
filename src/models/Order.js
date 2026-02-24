import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: String },        
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  image:     { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: [true, "Full name is required"] },
      email:    { type: String, required: [true, "Email is required"] },
      phone:    { type: String },
    },

    address: {
      street:  { type: String, required: [true, "Street address is required"] },
      city:    { type: String, required: [true, "City is required"] },
      state:   { type: String },
      zip:     { type: String },
      country: { type: String, default: "Pakistan" },
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: "Order must have at least one item",
      },
    },

    subtotal:      { type: Number, required: true },
    deliveryFee:   { type: Number, default: 0 },
    total:         { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "card", "bank_transfer"],
      default: "cod",
    },

    notes: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);