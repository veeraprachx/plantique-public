const mongoose = require("mongoose");

const plantImageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the plant or image
  image: { type: String, required: true }, // Base64-encoded image
  timestamp: { type: Date, default: Date.now }, // Timestamp of when the image was added
});

plantImageSchema.index({ name: 1, timestamp: -1 });

const PlantImage = mongoose.model("PlantImage", plantImageSchema);

module.exports = PlantImage;
