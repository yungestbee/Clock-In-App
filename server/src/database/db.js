const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const url = process.env.ATLAS_DATABASE;
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/clock-in-app");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
