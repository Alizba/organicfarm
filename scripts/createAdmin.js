// scripts/createAdmin.js
// Run to create admin or shopkeeper accounts:
//
//   node scripts/createAdmin.js admin
//   node scripts/createAdmin.js shopkeeper

const mongoose = require("mongoose");
const bcryptjs  = require("bcryptjs");
const path      = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const userSchema = new mongoose.Schema(
  {
    userName:   { type: String, required: true, unique: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    isVerified: { type: Boolean, default: true },
    role:       { type: String, enum: ["shopkeeper", "admin"], default: "shopkeeper" },
    isAdmin:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

const ACCOUNTS = {
  admin: {
    userName: "admin",
    email:    process.env.ADMIN_EMAIL || "fruiter@admin.com",
    password: "Admin@123",                // change this
    role:     "admin",
  },
  shopkeeper: {
    userName: "shopkeeper1",
    email:    "shopkeeper1@bioprox.com",  // change this
    password: "Shop@123",                 // change this
    role:     "shopkeeper",
  },
};

async function main() {
  const roleArg = process.argv[2];

  if (!roleArg || !["admin", "shopkeeper"].includes(roleArg)) {
    console.error("Please specify a role: admin or shopkeeper");
    console.error("Example: node scripts/createAdmin.js admin");
    process.exit(1);
  }

  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not set in your .env file");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");

  const data = ACCOUNTS[roleArg];

  const existing = await User.findOne({
    $or: [{ email: data.email }, { userName: data.userName }],
  });

  if (existing) {
    console.log("Account already exists:");
    console.log("  Email:   ", existing.email);
    console.log("  Username:", existing.userName);
    console.log("  Role:    ", existing.role);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcryptjs.hash(data.password, 12);

  const user = await User.create({
    userName:   data.userName,
    email:      data.email,
    password:   hashedPassword,
    role:       data.role,
    isVerified: true,
    isAdmin:    data.role === "admin",
  });

  console.log(`\n${roleArg} account created!`);
  console.log("  Email:   ", user.email);
  console.log("  Username:", user.userName);
  console.log("  Role:    ", user.role);
  console.log("\n  You can now log in at /login\n");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});