/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema(
  {
    result: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    firstAidRecommendation: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
