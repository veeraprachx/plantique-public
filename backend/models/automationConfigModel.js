// models/automationConfigModel.js
const mongoose = require("mongoose");
const automationConfigSchema = new mongoose.Schema({
  autoWateringEnabled: { type: Boolean, default: true },
  autoFoggingEnabled: { type: Boolean, default: true },
});
module.exports = mongoose.model("AutomationConfig", automationConfigSchema);
