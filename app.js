/** @format */
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const predictRoutes = require("./routes/predict");

const app = express();

// app.use(bodyParser.urlEncoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

// STATIC IMAGES
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

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    "mongodb+srv://sahalnurdin888:VdqXjEbZ5l58gwW6@cluster0.y7olrqd.mongodb.net/results?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
