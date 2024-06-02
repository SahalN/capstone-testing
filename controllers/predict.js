/** @format */
const { validationResult } = require("express-validator");

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
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect",
      errors: errors.array(),
    });
  }
  const result = req.body.result;
  const category = req.body.category;
  const explanation = req.body.explanation;
  const suggestion = req.body.suggestion;
  // Create result in db
  res.status(201).json({
    message: "predict created successfully!",
    result: {
      id: new Date().toISOString(),
      result: result,
      category: category,
      explanation: explanation,
      suggestion: suggestion,
      user: {
        name: "Budi",
      },
      createdAt: new Date(),
    },
  });
};
