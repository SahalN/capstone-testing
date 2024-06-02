/** @format */

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
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

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: "predict created successfully!",
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content,
    },
  });
};
