const mongoose = require("mongoose");

const ImageAnalysisSchema = new mongoose.Schema({
  image: { type: String, required: true }, // base64 string
  description: { type: String, required: true }, // GPT’s analysis
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ImageAnalysis", ImageAnalysisSchema);
