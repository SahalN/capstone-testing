/** @format */

const tf = require("@tensorflow/tfjs-node");

async function predictClassification(model, imageBuffer) {
  try {
    // Decode the image buffer and preprocess it
    const imageTensor = tf.node
      .decodeImage(imageBuffer, 3) // Decode with 3 channels (RGB)
      .resizeNearestNeighbor([224, 224]) // Resize to match model input shape
      .expandDims() // Add batch dimension
      .toFloat()
      .div(tf.scalar(255)); // Scale pixel values to [0, 1]

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

    return { confidenceScore, label };
  } catch (error) {
    console.error("Error during prediction:", error);
    throw error;
  }
}

module.exports = predictClassification;
