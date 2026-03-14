import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    slug:       { type: String, required: true, unique: true, trim: true },
    content:    { type: String, required: true },
    coverImage: { type: String, default: "" },
    authorName: { type: String, required: true },
    authorId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorRole: { type: String, enum: ["admin", "shopkeeper"], required: true },
    category:   { type: String, default: "general", trim: true },
    tags:       [{ type: String, trim: true }],
    published:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;