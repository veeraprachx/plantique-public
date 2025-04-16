const express = require("express");
const router = express.Router();
const environmentController = require("../controllers/environmentController");

// Create
router.post("/", environmentController.createEnvironment);

// Read All
router.get("/", environmentController.getAllEnvironment);

// Read By ID
router.get("/:id", environmentController.getEnvironmentById);

// Update
router.put("/:id", environmentController.updateEnvironment);

// Delete
router.delete("/:id", environmentController.deleteEnvironment);

// Route to get the sum from the Python model
router.post("/mock-sum-log", environmentController.getMockSumAndLog);

module.exports = router;
