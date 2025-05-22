const Foggy = require("../models/foggyModel");
// const { publishWithRetryFoggy } = require("../services/mqtt-service");

// Create a new Foggy command (POST /foggys)
const createFoggy = async (req, res) => {
  try {
    let { time } = req.body;

    //bound
    if (time > 60000 || time < 0) time = 0;

    // 1) Fail out any existing pending commands
    await Foggy.updateMany({ status: "pending" }, { $set: { status: "fail" } });

    const newFoggy = new Foggy({ time });
    await newFoggy.save();

    res.status(201).json(newFoggy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFoggys = async (req, res) => {
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

    // 2) Start the query, sorted by newest first
    let query = Foggy.find(filter).sort({ timestamp: -1 });

    // 3) Apply skip/limit if both page & limit are provided
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
