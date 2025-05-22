// controllers/environmentController.js
const LatestEnvironment = require("../models/latestEnvironmentModel");

exports.getLatestEnvironment = async (req, res) => {
  try {
    const data = await LatestEnvironment.findById("latestEnvironment");
    if (!data) {
      return res
        .status(404)
        .json({ message: "No latest environment data found" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
