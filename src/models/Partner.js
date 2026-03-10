import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    image:    { type: String, required: true }, 
    isActive: { type: Boolean, default: true },
    order:    { type: Number, default: 0 },     
  },
  { timestamps: true }
);

export default mongoose.models.Partner || mongoose.model("Partner", partnerSchema);