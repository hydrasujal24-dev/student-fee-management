const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({
      email: "admin@test.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "System Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully:");
    console.log(admin.email);
    console.log(admin.role);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();