/** @format */

const express = require("express");

const predictController = require("../controllers/predict");

const router = express.Router();

// GET /predict/results
router.get("/results", predictController.getPosts);

// POST /predict/result
router.post("/result", predictController.createPost);

module.exports = router;
