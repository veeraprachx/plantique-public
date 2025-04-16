const PlantImage = require("../models/plantImageModel");

// Create a new plant image
exports.createPlantImage = async (req, res) => {
  try {
    const { name, image } = req.body;

    // Ensure both fields are provided
    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // Create and save the new plant image
    const newPlantImage = new PlantImage({ name, image });
    const savedImage = await newPlantImage.save();

    res
      .status(201)
      .json({ message: "Plant image created successfully", data: savedImage });
  } catch (error) {
    res.status(500).json({ message: "Error creating plant image", error });
  }
};

// Get all plant images
exports.getAllPlantImages = async (req, res) => {
  try {
    const images = await PlantImage.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plant images", error });
  }
};

// Get a single plant image by ID
exports.getPlantImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await PlantImage.findById(id);

    if (!image) {
      return res.status(404).json({ message: "Plant image not found" });
    }

    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plant image", error });
  }
};

// Update a plant image by ID
exports.updatePlantImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const updatedImage = await PlantImage.findByIdAndUpdate(
      id,
      { name, image },
      { new: true } // Return the updated document
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Plant image not found" });
    }

    res.status(200).json({
      message: "Plant image updated successfully",
      data: updatedImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating plant image", error });
  }
};

// Delete a plant image by ID
exports.deletePlantImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await PlantImage.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ message: "Plant image not found" });
    }

    res.status(200).json({ message: "Plant image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting plant image", error });
  }
};
