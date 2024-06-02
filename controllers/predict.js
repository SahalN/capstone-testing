/** @format */
const { validationResult } = require("express-validator");
const Result = require("../models/result");

exports.getResults = (req, res, next) => {
  res.status(200).json({
    results: [
      {
        _id: "1",
        result: "Melanocytic nevi",
        category: "Cancer",
        explanation:
          "Melanocytic nevi atau tahi lalat biasanya tidak memerlukan pengobatan  kecuali ada kekhawatiran tentang perubahan menjadi kanker kulit seperti  melanoma.",
        suggestion:
          "Pengobatan yang disarankan meliputi pemantauan rutin untuk perubahan  ukuran, bentuk, atau warna; biopsi jika ada kecurigaan; pengangkatan  bedah untuk tahi lalat yang mencurigakan atau teriritasi; dan  pemeriksaan dermatologi digital menggunakan dermatoskopi. Konsultasi  dengan dokter kulit sangat penting untuk diagnosis dan pengobatan yang  tepat.",
        imageUrl: "images/cancer-1.png",
        user: {
          name: "Budi",
        },
        createdAt: new Date(),
      },
    ],
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
  const result = req.body.result;
  const category = req.body.category;
  const explanation = req.body.explanation;
  const suggestion = req.body.suggestion;
  // Create result in db
  const resultDb = new Result({
    result: result,
    category: category,
    explanation: explanation,
    suggestion: suggestion,
    imageUrl: "images/cancer-1.png",
    user: {
      name: "Budi",
    },
  });
  resultDb
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Result created successfully!",
        resultDb: resultDb,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
