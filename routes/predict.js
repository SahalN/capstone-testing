/** @format */

const express = require("express");

const predictController = require("../controllers/predict");

const router = express.Router();

// GET /predict/posts
router.get("/posts", predictController.getPosts);

// POST /predict/post
router.post("/post", predictController.createPost);

module.exports = router;
