// routes/automationConfigRoutes.js
const express = require("express");
const router = express.Router();
const AutomationConfig = require("../models/automationConfigModel");

// Get current settings
router.get("/", async (req, res) => {
  let config = await AutomationConfig.findOne();
  if (!config) config = await AutomationConfig.create({});
  res.json(config);
});

// Update settings
router.patch("/", async (req, res) => {
  const updates = {
    autoWateringEnabled: req.body.autoWateringEnabled,
    autoFoggingEnabled: req.body.autoFoggingEnabled,
  };
  const config = await AutomationConfig.findOneAndUpdate({}, updates, {
    new: true,
    upsert: true,
  });
  res.json(config);
});

module.exports = router;
