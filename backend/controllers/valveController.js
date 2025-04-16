const Valve = require("../models/valveModel");
// const { publishWithRetryValve } = require("../services/mqtt-service");

// Create a new Valve command (POST /valves)
const createValve = async (req, res) => {
  try {
    let { time, timestamp } = req.body;

    //bound
    if (time > 60000 || time < 0) time = 0;

    const newValve = new Valve({ time, timestamp });
    await newValve.save();
    console.log("newValve: ", newValve);

    // Prepare the command to send to the Arduino
    // const valveData = {
    //   context: "valve",
    //   contextData: {
    //     time: newValve.time, // use the posted time value
    //   },
    // };

    // Publish the command with retry logic for valve commands
    // publishWithRetryValve("plantique/commands/cGxhbnRpcXVl", valveData);
    // console.log("valveData: ", valveData);

    res.status(201).json(newValve);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Valve records
const getValves = async (req, res) => {
  try {
    const valves = await Valve.find();
    res.status(200).json(valves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Valve record by its _id
const getValveById = async (req, res) => {
  try {
    const valve = await Valve.findById(req.params.id);
    if (!valve)
      return res.status(404).json({ message: "Valve record not found" });
    res.status(200).json(valve);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Valve record by its _id
const updateValve = async (req, res) => {
  try {
    const updatedValve = await Valve.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedValve)
      return res.status(404).json({ message: "Valve record not found" });
    res.status(200).json(updatedValve);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Valve record by its _id
const deleteValve = async (req, res) => {
  try {
    const deletedValve = await Valve.findByIdAndDelete(req.params.id);
    if (!deletedValve)
      return res.status(404).json({ message: "Valve record not found" });
    res.status(200).json({ message: "Valve record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createValve,
  getValves,
  getValveById,
  updateValve,
  deleteValve,
};
