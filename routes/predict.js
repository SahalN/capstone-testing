/** @format */

const express = require("express");

const predictController = require("../controllers/predict");

const router = express.Router();

// GET /predict/results
router.get("/results", predictController.getResults);

// POST /predict/result
router.post("/result", predictController.createResult);

module.exports = router;
