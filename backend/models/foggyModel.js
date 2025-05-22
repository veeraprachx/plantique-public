const mongoose = require("mongoose");

const foggySchema = new mongoose.Schema({
  time: { type: Number, required: true }, // Duration of operation
  timestamp: { type: Date, default: Date.now },
  source: { type: String, default: "manual" },
  status: { type: String, default: "pending" },
});

const Foggy = mongoose.model("Foggy", foggySchema);

module.exports = Foggy;
