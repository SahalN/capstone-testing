/** @format */
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

async function predictClassification(model, imagePath) {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);

    // Decode the image buffer and preprocess it
    const imageTensor = tf.node
      .decodeImage(imageBuffer)
      .resizeBilinear([224, 224]) // Resize to match model input shape
      .expandDims() // Add batch dimension
      .toFloat();

    // Make prediction
    const prediction = model.predict(imageTensor);
    const scores = await prediction.data();
    const confidenceScore = Math.max(...scores) * 100;

    const classes = [
      "Melanocytic nevus",
      "Squamous cell carcinoma",
      "Vascular lesion",
    ];

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];
    console.log(label);
    console.log(confidenceScore);

    return { confidenceScore, label };
  } catch (error) {
    console.error("Error during prediction:", error);
    throw error;
  }
}

module.exports = predictClassification;
