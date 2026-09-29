const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const email = process.argv[2];

if (!email) {
  console.log("Please provide an email address.");
  console.log("Example: node makeAdmin.js your@email.com");
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      console.log("User not found.");
      console.log("Make sure you use the email you registered with.");
      process.exit(1);
    }

    user.role = "admin";

    await user.save();

    console.log("");
    console.log("=================================");
    console.log("ADMIN ACCOUNT CREATED");
    console.log("=================================");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("=================================");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

makeAdmin();