const Foggy = require("../models/foggyModel");
// const { publishWithRetryFoggy } = require("../services/mqtt-service");

// Create a new Foggy command (POST /foggys)
const createFoggy = async (req, res) => {
  try {
    let { time } = req.body;

    //bound
    if (time > 60000 || time < 0) time = 0;

    const newFoggy = new Foggy({ time });
    await newFoggy.save();
    console.log("newFoggy: ", newFoggy);

    // Prepare the command to send to the Arduino
    // const foggyData = {
    //   context: "foggy",
    //   contextData: {
    //     time: newFoggy.time, // use the posted time value
    //   },
    // };

    // // Publish the command with retry logic
    // publishWithRetryFoggy("plantique/commands/cGxhbnRpcXVl", foggyData);
    // console.log("foggyData: ", foggyData);

    res.status(201).json(newFoggy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Foggy records
const getFoggys = async (req, res) => {
  try {
    const foggys = await Foggy.find();
    res.status(200).json(foggys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Foggy record by its _id
const getFoggyById = async (req, res) => {
  try {
    const foggy = await Foggy.findById(req.params.id);
    if (!foggy)
      return res.status(404).json({ message: "Foggy record not found" });
    res.status(200).json(foggy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Foggy record by its _id
const updateFoggy = async (req, res) => {
  try {
    const updatedFoggy = await Foggy.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedFoggy)
      return res.status(404).json({ message: "Foggy record not found" });
    res.status(200).json(updatedFoggy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Foggy record by its _id
const deleteFoggy = async (req, res) => {
  try {
    const deletedFoggy = await Foggy.findByIdAndDelete(req.params.id);
    if (!deletedFoggy)
      return res.status(404).json({ message: "Foggy record not found" });
    res.status(200).json({ message: "Foggy record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFoggy,
  getFoggys,
  getFoggyById,
  updateFoggy,
  deleteFoggy,
};
