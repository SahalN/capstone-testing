/** @format */
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Result = require("../models/result");
const User = require("../models/user");

exports.getResults = (req, res, next) => {
  Result.find()
    .then((results) => {
      res.status(200).json({
        message: "Fetched posts successfully.",
        results: results,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createResult = (req, res, next) => {
  // VALIDATION
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  /** REPLACE ALL '\' WITH '/' */
  const imageUrl = req.file.path.replace("\\", "/");
  const result = req.body.result;
  const category = req.body.category;
  const explanation = req.body.explanation;
  const suggestion = req.body.suggestion;
  let user;
  // Create result in db
  const resultDb = new Result({
    result: result,
    category: category,
    explanation: explanation,
    suggestion: suggestion,
    imageUrl: imageUrl,
    user: req.userId,
  });
  resultDb
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user1) => {
      user = user1;
      user.results.push(resultDb);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Result created successfully!",
        resultDb: resultDb,
        user: { _id: user._id, name: user.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getResult = (req, res, next) => {
  const resultId = req.params.resultId;
  Result.findById(resultId)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find result.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Result fetched.",
        result: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteResult = (req, res, next) => {
  const resultId = req.params.resultId;
  Result.findById(resultId)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find result.");
        error.statusCode = 404;
        throw error;
      }
      if (result.user.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      //CHECK LOGGED IN USER
      clearImage(result.imageUrl);
      return Result.findByIdAndDelete(resultId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.results.pull(resultId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted Result." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
