import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true }, 
    label:       { type: String, required: true },              
    icon:        { type: String, default: "🌿" },               
    description: { type: String, default: "" },
    gradient:    { type: String, default: "#e8f5e9,#c8e6c9" },  
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);