const mongoose = require("mongoose");

const ClockInSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor", // Reference to the Instructor model
    required: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }, // Store readable address if needed
  },
  status: {
    type: String,
    enum: ["Success", "Failed"],
    required: true,
  },
  reason: {
    type: String, // Only used if status is "Failed" (e.g., "Out of allowed zone")
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClockIn", ClockInSchema);
