const mongoose = require("mongoose");

const fanSchema = new mongoose.Schema({
  time: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  source: { type: String, default: "manual" }, // e.g., "manual" or "automation"
  status: { type: String, default: "pending" }, // e.g., "pending", "complete"
});

const Fan = mongoose.model("Fan", fanSchema);

module.exports = Fan;
