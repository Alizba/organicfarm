import mongoose from "mongoose";

const shopRequestSchema = new mongoose.Schema(
  {
    // Applicant info — stored directly, no User exists yet
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    email:    { type: String, required: true },
    phone:    { type: String },

    // Hashed password — will be copied to User on approval
    password: { type: String, required: true },

    // Shop info
    shopName:        { type: String, required: true },
    shopDescription: { type: String },

    // Approval state
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Filled in after admin approves — links to the created User
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