/** @format */

const express = require("express");
const { body } = require("express-validator");
const predictController = require("../controllers/predict");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /predict/results
router.get("/results", isAuth, predictController.getResults);

// POST /predict/result
router.post(
  "/result",
  isAuth,
  [
    body("result").trim().isLength({ min: 5 }),
    body("explanation").trim().isLength({ min: 5 }),
    body("firstAidRecommendation").trim().isLength({ min: 5 }),
  ],
  predictController.createResult
);

// GET /predict/result/resultId
router.get("/result/:resultId", isAuth, predictController.getResult);

// DELETE /predict/result/resultId
router.delete("/result/:resultId", isAuth, predictController.deleteResult);

module.exports = router;
