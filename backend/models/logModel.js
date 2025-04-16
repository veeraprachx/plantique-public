const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  action: {
    type: String,
    default: "unknown",
  },
  duration: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "manual",
  },
  status: {
    type: String,
    default: "unknown",
  },
});
const Log = mongoose.model("Log", logSchema);
module.exports = Log;
