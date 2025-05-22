const express = require("express");
const router = express.Router();
const Foggy = require("../models/foggyModel");
const Valve = require("../models/valveModel");

router.get("/arduino", async (req, res) => {
  try {
    const command1 = await Foggy.findOne({ status: "pending" }).sort({
      timestamp: -1,
    });
    const command2 = await Valve.findOne({ status: "pending" }).sort({
      timestamp: -1,
    });

    if (command1 || command2) {
      if (command1) {
        await Foggy.findByIdAndUpdate(command1._id, { status: "complete" });
        return res.status(200).json({
          context: "foggy",
          contextData: { time: command1.time },
        });
      }
      if (command2) {
        await Valve.findByIdAndUpdate(command2._id, { status: "complete" });
        return res.status(200).json({
          context: "water",
          contextData: { time: command2.time },
        });
      }
    } else {
      return res.status(200).json({
        context: "null",
      });
    }
  } catch (err) {
    console.error("Error checking for command:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
