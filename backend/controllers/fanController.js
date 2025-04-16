const Fan = require("../models/fanModel");
// const Log = require("../models/logModel");
// const { publishWithRetryFan } = require("../services/mqtt-service");
// Create a new Fan command (POST /fans)
const createFan = async (req, res) => {
  try {
    let { time } = req.body;

    //bound
    if (time > 60000 || time < 0) time = 0;

    const newFan = new Fan({ time });
    await newFan.save();
    console.log("newFan: ", newFan);
    // await new Log({
    //   action: "Fan",
    //   duration: time,
    //   type: "manual",
    //   status: "pending",
    // }).save();

    // Prepare the command to send to the Arduino
    // const fanData = {
    //   context: "fan",
    //   contextData: {
    //     time: newFan.time, // use the posted time value
    //   },
    // };

    // Publish the command with retry logic
    // publishWithRetryFan("plantique/commands/cGxhbnRpcXVl", fanData);
    // console.log("fanData: ", fanData);

    res.status(201).json(newFan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Fans
const getFans = async (req, res) => {
  try {
    const fans = await Fan.find();
    res.status(200).json(fans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Fan by its _id
const getFanById = async (req, res) => {
  try {
    const fan = await Fan.findById(req.params.id);
    if (!fan) return res.status(404).json({ message: "Fan not found" });
    res.status(200).json(fan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Fan by its _id
const updateFan = async (req, res) => {
  try {
    const updatedFan = await Fan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedFan) return res.status(404).json({ message: "Fan not found" });
    res.status(200).json(updatedFan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Fan by its _id
const deleteFan = async (req, res) => {
  try {
    const deletedFan = await Fan.findByIdAndDelete(req.params.id);
    if (!deletedFan) return res.status(404).json({ message: "Fan not found" });
    res.status(200).json({ message: "Fan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createFan, getFans, getFanById, updateFan, deleteFan };
