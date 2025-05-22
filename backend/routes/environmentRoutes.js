const express = require("express");
const router = express.Router();
const environmentController = require("../controllers/environmentController");

// router.delete("/mock", environmentController.deleteMockEnvironmentData);

// Create
router.post("/", environmentController.createEnvironment);

// Read
router.get("/", environmentController.getEnvironments);

// Read By ID
router.get("/:id", environmentController.getEnvironmentById);

// Update
router.put("/:id", environmentController.updateEnvironment);

// Delete
router.delete("/:id", environmentController.deleteEnvironment);

module.exports = router;
