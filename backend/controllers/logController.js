const Log = require("../models/logModel");

// CREATE a new log
exports.createLog = async (req, res) => {
  try {
    const newLog = new Log(req.body);
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ all logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ a single log by ID
exports.getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findById(id);
    if (!log) {
      return res.status(404).json({ error: "Log not found" });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a log by ID
exports.updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLog = await Log.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedLog) {
      return res.status(404).json({ error: "Log not found" });
    }
    res.status(200).json(updatedLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a log by ID
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLog = await Log.findByIdAndDelete(id);
    if (!deletedLog) {
      return res.status(404).json({ error: "Log not found" });
    }
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
