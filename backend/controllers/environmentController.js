const Environment = require("../models/environmentModel");
const LatestEnvironment = require("../models/latestEnvironmentModel");
const { spawn } = require("child_process");
const {
  broadcastEnvironmentUpdate,
  broadcastCountdown,
} = require("../websocket");

const { processSensorData } = require("../services/automate");

// const EnviCountdown = require("../models/enviCountdownModel");

let secondsLeft = 14; // start full
const INTERVAL = 14;

async function initTimer() {
  const latest = await LatestEnvironment.findById("latestEnvironment");
  if (latest) {
    const elapsedSec = Math.floor(
      (Date.now() - latest.timestamp.getTime()) / 1000
    );
    secondsLeft = Math.max(0, INTERVAL - elapsedSec);
  }
}
// Seed once immediately
initTimer();

// Re-sync every 60 seconds
setInterval(() => {
  initTimer();
}, 60 * 1000);

/* ---------- second‑ticker ---------- */
setInterval(() => {
  if (secondsLeft === null) return;
  secondsLeft -= 1;
  if (secondsLeft <= 0) secondsLeft = 0;
  broadcastCountdown(secondsLeft);
}, 1000);
/* ----------------------------------- */

// Create new environmentInfo
exports.createEnvironment = async (req, res) => {
  try {
    const { airTemp, airPercentHumidity, soilTemp, soilPercentHumidity } =
      req.body;

    const lastRecord = await Environment.findOne().sort({ timestamp: -1 });

    let shouldSave = false;

    let payload = {
      airTemp,
      airPercentHumidity,
      soilTemp,
      soilPercentHumidity,
      timestamp: new Date(),
    };

    // Save new record if > 50 seconds have passed
    if (
      !lastRecord ||
      new Date() - new Date(lastRecord.timestamp) > 50 * 1000
    ) {
      await Environment.create(payload);
      processSensorData(payload);

      shouldSave = true;
    }

    await LatestEnvironment.findByIdAndUpdate("latestEnvironment", payload, {
      upsert: true,
    });

    console.log("payload: ", payload);

    secondsLeft = INTERVAL;

    broadcastEnvironmentUpdate(payload);

    // broadcastCountdown(secondsLeft);

    res.status(201).json({
      message: shouldSave
        ? "Reading saved (time gap > 50s)."
        : "Reading skipped (too soon).",
      data: payload,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating environment info", error });
  }
};

// Read all environmentInfo
exports.getAllEnvironment = async (req, res) => {
  try {
    const data = await Environment.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching environment info", error });
  }
};

exports.getEnvironments = async (req, res) => {
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
    console.log("filter: ", filter);

    // 2) Start the query
    let query = Environment.find(filter).sort({ timestamp: -1 });

    // 3) Only apply skip/limit if both page+limit are provided
    if (page && limit) {
      const p = parseInt(page, 10);
      const l = parseInt(limit, 10);
      const skip = (p - 1) * l;
      query = query.skip(skip).limit(l);
    }

    // 4) Execute and return
    const data = await query;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read a single environmentInfo by ID
exports.getEnvironmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Environment.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Environment info not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching environment info", error });
  }
};

// Update environmentInfo by ID
exports.updateEnvironment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await Environment.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({ message: "Environment info not found" });
    }

    res.status(200).json({
      message: "Environment info updated successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating environment info", error });
  }
};

// Delete environmentInfo by ID
exports.deleteEnvironment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await Environment.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: "Environment info not found" });
    }

    res.status(200).json({ message: "Environment info deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting environment info", error });
  }
};

exports.deleteMockEnvironmentData = async (req, res) => {
  try {
    const result = await Environment.deleteMany({
      airTemp: 45,
      airPercentHumidity: 50,
      soilTemp: 0,
      soilPercentHumidity: 70,
    });
    res.status(200).json({
      message: `Deleted ${result.deletedCount} mock environment record(s)`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting mock data", error: error.toString() });
  }
};
