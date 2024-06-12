/** @format */
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const predictRoutes = require("./routes/predict");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const loadModel = require("./services/loadModel");

const app = express();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/bmp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(bodyParser.json()); // application/json

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/predict", predictRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const startServer = async () => {
  try {
    const model = await loadModel();
    app.locals.model = model;

    const port = process.env.PORT || 3000;

    const mongodbUri = process.env.MONGODB_URI;

    await mongoose.connect(mongodbUri);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
