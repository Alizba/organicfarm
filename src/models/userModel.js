import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    isVerified: {
      type: Boolean,
      default: false, 
    },
    role: {
      type: String,
      enum: ["user", "shopkeeper", "admin"], 
      default: "user", 
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    shopName: { type: String, default: null },
    shopDescription: { type: String, default: null },
    phone: { type: String, default: null },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;