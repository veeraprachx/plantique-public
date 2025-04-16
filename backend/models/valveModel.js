const mongoose = require("mongoose");

const valveSchema = new mongoose.Schema({
  time: { type: Number, required: true }, // Duration of operation
  timestamp: { type: Date, default: Date.now },
  source: { type: String, default: "manual" },
  status: { type: String, default: "pending" },
});

const Valve = mongoose.model("Valve", valveSchema);

module.exports = Valve;
