/** @format */
const tf = require("@tensorflow/tfjs-node");
// const fs = require("fs");
// const fetch = require("node-fetch");

async function predictClassification(model, imageUrl) {
  try {
    // Read the image file
    // const imageBuffer = fs.readFileSync(imagePath);
    // Fetch the image from the URL
    const { default: fetch } = await import("node-fetch");
    const response = await fetch(imageUrl);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
    }
    const imageBuffer = await response.buffer();

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
