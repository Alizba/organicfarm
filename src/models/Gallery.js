import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    image:       { type: String, required: true },
    description: { type: String, default: "" },
    category:    { type: String, default: "general", enum: ["general", "farm", "products", "events", "team"] },
    uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);
export default Gallery;