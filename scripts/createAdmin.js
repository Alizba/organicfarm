import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const userSchema = new mongoose.Schema({
  userName:        String,
  email:           String,
  password:        String,
  isVerified:      { type: Boolean, default: true },
  role:            { type: String, default: "shopkeeper" },
  isAdmin:         { type: Boolean, default: false },
  shopName:        String,
  shopDescription: String,
  phone:           String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createShopkeeper() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");

  const email    = "shopkeeper@test.com";
  const password = "shopkeeper123";
  const userName = "test_shopkeeper";
  const shopName = "Test Shop";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Account already exists! Login with:");
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcryptjs.hash(password, 10);
  await User.create({
    userName,
    email,
    password:    hashed,
    role:        "shopkeeper",
    isVerified:  true,
    shopName,
    shopDescription: "A test shop for development",
  });

  console.log("✅ Test shopkeeper created!");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  ShopName: ${shopName}`);
  console.log("\nNow log in at /login with these credentials.");

  await mongoose.disconnect();
}

createShopkeeper().catch(console.error);