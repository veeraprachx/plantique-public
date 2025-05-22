// models/latestEnvironmentModel.js
const mongoose = require("mongoose");

const latestEnvironmentSchema = new mongoose.Schema({
  _id: { type: String, default: "latestEnvironment" }, // fixed ID
  airTemp: { type: Number, required: true },
  airPercentHumidity: { type: Number, required: true },
  soilTemp: { type: Number, required: true },
  soilPercentHumidity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LatestEnvironment", latestEnvironmentSchema);
