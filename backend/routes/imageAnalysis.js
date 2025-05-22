const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/imageAnalysisController");

router.post("/", ctrl.create);
router.get("/", ctrl.list);
router.delete("/:id", ctrl.delete);

module.exports = router;
