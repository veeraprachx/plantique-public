const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// CREATE
router.post("/", logController.createLog);

// READ
router.get("/", logController.getLogs);
router.get("/:id", logController.getLogById);

// UPDATE
router.put("/:id", logController.updateLog);

// DELETE
router.delete("/:id", logController.deleteLog);

module.exports = router;
