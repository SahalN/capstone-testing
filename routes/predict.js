/** @format */
const express = require("express");
const { body } = require("express-validator");
const predictController = require("../controllers/predict");
const isAuth = require("../middleware/is-auth");
const imgUpload = require("../modules/imgUpload");
// const Multer = require("multer");

const router = express.Router();

// const multer = Multer({
//   storage: Multer.MemoryStorage,
//   fileSize: 5 * 1024 * 1024,
// });

// GET /predict/results
router.get("/results", isAuth, predictController.getResults);

// POST /predict/result
router.post(
  "/result",
  isAuth,
  imgUpload.uploadToGcs,
  predictController.createResult
);

// GET /predict/result/resultId
router.get("/result/:resultId", isAuth, predictController.getResult);

// DELETE /predict/result/resultId
router.delete("/result/:resultId", isAuth, predictController.deleteResult);

// router.post(
//   "/uploadImage",
//   multer.single("image"),
//   imgUpload.uploadToGcs,
//   (req, res) => {
//     const data = req.body;
//     if (req.file && req.file.cloudStoragePublicUrl) {
//       data.imageUrl = req.file.cloudStoragePublicUrl;
//     }
//     res.status(201).json({
//       message: "Image uploaded successfully",
//       imageUrl: data.imageUrl,
//     });
//   }
// );

module.exports = router;
