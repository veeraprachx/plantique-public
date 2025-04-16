const express = require("express");
const {
  createFoggy,
  getFoggys,
  getFoggyById,
  updateFoggy,
  deleteFoggy,
} = require("../controllers/foggyController");

const router = express.Router();

// Create a new Foggy
router.post("/", createFoggy);

// Get all Foggies
router.get("/", getFoggys);

// Get a single Foggy by ID
router.get("/:id", getFoggyById);

// Update a Foggy by ID
router.put("/:id", updateFoggy);

// Delete a Foggy by ID
router.delete("/:id", deleteFoggy);

module.exports = router;
