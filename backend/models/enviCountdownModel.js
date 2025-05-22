const mongoose = require("mongoose");

const enviCountdownSchema = new mongoose.Schema({
  _id: { type: String, default: "enviCountdown" }, // fixed ID
  secondsLeft: { type: Number, default: 14 },
});

module.exports = mongoose.model("EnviCountdown", enviCountdownSchema);
