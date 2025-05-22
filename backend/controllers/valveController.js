const Valve = require("../models/valveModel");
// const { publishWithRetryValve } = require("../services/mqtt-service");

// Create a new Valve command (POST /valves)
const createValve = async (req, res) => {
  try {
    let { time, timestamp } = req.body;

    //bound
    if (time > 1200000 || time < 0) time = 0;

    // 1) Fail out any existing pending commands
    await Valve.updateMany({ status: "pending" }, { $set: { status: "fail" } });

    const newValve = new Valve({ time, timestamp });

    await newValve.save();

    res.status(201).json(newValve);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getValves = async (req, res) => {
  try {
    const { startDate, endDate, page, limit } = req.query;

    // 1) Build the date filter
    const filter = {};
    if (startDate) {
      filter.timestamp = { $gte: new Date(startDate) };
    }
    if (endDate) {
      filter.timestamp = {
        ...(filter.timestamp || {}),
        $lte: new Date(endDate),
      };
    }

    // 2) Start the query, sorting newest first
    let query = Valve.find(filter).sort({ timestamp: -1 });

    // 3) If both page & limit are provided, apply skip & limit
    if (page && limit) {
      const p = parseInt(page, 10);
      const l = parseInt(limit, 10);
      const skip = (p - 1) * l;
      query = query.skip(skip).limit(l);
    }

    // 4) Execute and return
    const data = await query;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
