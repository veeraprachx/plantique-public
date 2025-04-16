const express = require('express');
const router = express.Router();
const plantImageController = require('../controllers/plantImageController');

// Create a new plant image
router.post('/', plantImageController.createPlantImage);

// Get all plant images
router.get('/', plantImageController.getAllPlantImages);

// Get a plant image by ID
router.get('/:id', plantImageController.getPlantImageById);

// Update a plant image by ID
router.put('/:id', plantImageController.updatePlantImage);

// Delete a plant image by ID
router.delete('/:id', plantImageController.deletePlantImage);

module.exports = router;
