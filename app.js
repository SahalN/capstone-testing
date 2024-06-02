/** @format */

const express = require("express");
const bodyParser = require("body-parser");

const predictRoutes = require("./routes/predict");

const app = express();

// app.use(bodyParser.urlEncoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

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

app.listen(8080);
