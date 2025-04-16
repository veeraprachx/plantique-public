const express = require("express");

const {
  createFan,
  getFans,
  getFanById,
  updateFan,
  deleteFan,
} = require("../controllers/fanController");

const router = express.Router();

// Create a new Fan
router.post("/", createFan);

// Get all Fans
router.get("/", getFans);

// Get a single Fan by ID
router.get("/:id", getFanById);

// Update a Fan by ID
router.put("/:id", updateFan);

// Delete a Fan by ID
router.delete("/:id", deleteFan);

module.exports = router;
