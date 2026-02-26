import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: [true, "Product name is required"] },
    price:       { type: Number, required: [true, "Price is required"], min: 0 },
    description: { type: String },
    category:    { type: String },
    stock:       { type: Number, default: 0, min: 0 },
    image:       { type: String },

    // Links product to the shopkeeper who created it
    shopkeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Denormalized for easy display without joins
    shopName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);