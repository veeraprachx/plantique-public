const mongoose = require("mongoose");

const environmentSchema = new mongoose.Schema({
  airTemp: { type: Number, required: true },
  airPercentHumidity: { type: Number, required: true },
  soilTemp: { type: Number, required: true },
  soilPercentHumidity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Environment = mongoose.model("Environment", environmentSchema);

module.exports = Environment;
