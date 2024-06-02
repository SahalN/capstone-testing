/** @format */

const express = require("express");
const { body } = require("express-validator");
const predictController = require("../controllers/predict");

const router = express.Router();

// GET /predict/results
router.get("/results", predictController.getResults);

// POST /predict/result
router.post(
  "/result",
  [
    body("result").trim().isLength({ min: 5 }),
    body("category").trim().isLength({ min: 3 }),
    body("explanation").trim().isLength({ min: 5 }),
    body("suggestion").trim().isLength({ min: 5 }),
  ],
  predictController.createResult
);

module.exports = router;
