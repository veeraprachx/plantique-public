// routes/environmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getLatestEnvironment,
} = require("../controllers/latestEnvironmentController");

router.get("/", getLatestEnvironment);

module.exports = router;
