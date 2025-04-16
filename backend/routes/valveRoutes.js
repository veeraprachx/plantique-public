const express = require("express");
const {
  createValve,
  getValves,
  getValveById,
  updateValve,
  deleteValve,
} = require("../controllers/valveController");

const router = express.Router();

// Create a new Valve
router.post("/", createValve);

// Get all Valves
router.get("/", getValves);

// Get a single Valve by ID
router.get("/:id", getValveById);

// Update a Valve by ID
router.put("/:id", updateValve);

// Delete a Valve by ID
router.delete("/:id", deleteValve);

module.exports = router;
