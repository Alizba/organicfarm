import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"] },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    originalPrice: { type: Number, min: 0 }, 
    description: { type: String },
    category: { type: String },
    weight: { type: String }, 
    stock: { type: Number, default: 0, min: 0 },
    instock: { type: Boolean, default: true }, 
    isVegetarian: { type: Boolean, default: false },
    image: { type: String },

    shopkeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);